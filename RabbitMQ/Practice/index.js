const express = require('express');
const app = express();
const amqp = require('amqplib');
const amqpUrl = 'amqp://guest:guest@localhost:5672';
const queue = 'task_queue';

app.get('/', (req, res) => {
    res.send('Hello, World!');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = {
    consumeMessages
};  