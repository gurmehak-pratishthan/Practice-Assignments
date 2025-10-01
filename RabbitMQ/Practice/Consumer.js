const amqp = require('amqplib');

async function receiveMsg() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'task_queue';

  await channel.assertQueue(queue, { durable: true });
  console.log(" [*] Waiting for messages...");

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(" [x] Received:", msg.content.toString());
      channel.ack(msg); // acknowledge after processing
    }
  });
}

receiveMsg();
