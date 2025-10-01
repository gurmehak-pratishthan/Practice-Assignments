const client = require('./client');
const express = require('express');
require('dotenv').config();

// const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function setString(key, value) {
  await client.set(key, value);
}

async function getString(key) {
  const value = await client.get(key);
  return value;
}
const city_list = 'city_list';
async function manageList(city){
  
  
  await client.lrem(city_list, 0, city);
  await client.lpush(city_list, city);
  await client.ltrim(city_list, 0 , 9);

  const cities = await client.lrange(city_list, 0, -1);
  const allKeys = await client.keys('*'); // or track cache keys separately
  
  for (const key of allKeys) {
    // skip the list itself
    if (key !== city_list && !cities.includes(key)) {
      await client.del(key);
    }
  }
    
  

}
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/recent', async (req, res) => {
  const cities = await client.lrange(city_list, 0, -1);
  res.json({cities});
  

})
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const weatherOfCity = await getString(city);

  if (weatherOfCity) {
    await manageList(city);
    return res.json({city, weather : weatherOfCity, source: 'cache'});
  }
  else {

    //fetch lat lon from geo api
    try {

    
    const geoApi = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.API_KEY}`;
    const geoResp = await fetch(geoApi);
    const geoData = await geoResp.json();

    if (!geoData.length) return res.status(404).json({message: "City not found"});
    const { lat, lon } = geoData[0];

    //fetch weather from lat lon
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const weatherResp = await fetch(weatherApi);
    const weatherData = await weatherResp.json();
    if (weatherData.cod != 200) {
      return res.status(404).json({message: 'City not found'});
    }
    const weatherDesc = weatherData.weather[0].description;
    
    //store in redis
    await setString(city, weatherDesc);
    await manageList(city);
    return res.json({city, weather: weatherDesc, source: 'api'}); 


  }  catch (err) {
      return res.status(500).json({message: 'Internal Server Error'});
    }
  }
       

    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});     

module.exports = {
  setString,
  getString
};