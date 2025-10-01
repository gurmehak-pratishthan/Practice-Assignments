const amqp = require('amqplib');
const amqpUrl = 'amqp://guest:guest@localhost:5672';

async function sendMsg(msg) {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    const queueName = 'task_queue';

    await channel.assertQueue(queueName, {
        durable: true
    });
        
    channel.sendToQueue(queueName, Buffer.from(msg), {
        persistent: true
    });
    console.log("Message sent -> ", msg);
    await channel.close();
    await connection.close();

}

sendMsg("Hello World");