import express from 'express';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
// import userRoutes from './routes/User.js';
import userRoutes from './routes/user.js';

// import users from "../Data/UserData.json" assert { type: "json" };
import users from "./Data/UserData.json" with { type: "json" };




const app = express();
app.use(bodyparser.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

//sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 