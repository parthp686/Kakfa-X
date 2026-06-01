require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer-2',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

async function run() {
  try {
    console.log("Producer2 waiting for Kafka...");
    await new Promise(res => setTimeout(res, 5000));

    await producer.connect();
    console.log("Producer2 connected");

    // Send message every 5 seconds
    setInterval(async () => {
      const order = {
        id: Date.now(),
        userId: "auto-user",
        product: "Auto Generated Order",
        price: Math.floor(Math.random() * 1000)
      };

      await producer.send({
        topic: process.env.KAFKA_TOPIC,
        acks: -1,
        messages: [
          {
            key: order.userId,
            value: JSON.stringify(order)
          }
        ]
      });

      console.log("Producer2 sent:", order);

    }, 5000);

  } catch (err) {
    console.error("Producer2 error:", err);
  }
}

run();