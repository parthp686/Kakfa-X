// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'consumer-2',
//   brokers: ['localhost:9092']
// });

// const consumer = kafka.consumer({ groupId: 'notification-group' });

// async function run() {
//   await consumer.connect();

//   await consumer.subscribe({
//     topic: 'orders',
//     fromBeginning: true
//   });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const data = JSON.parse(message.value.toString());
//       console.log("Notification Service:", data);
//     }
//   });
// }

// run();

//New Code
// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'consumer-2',
//   brokers: ['localhost:9092']
// });

// const consumer = kafka.consumer({ groupId: 'notification-group' });

// async function run() {
//   await consumer.connect();

//   await consumer.subscribe({
//     topic: 'orders',
//     fromBeginning: true
//   });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       try {
//         const data = JSON.parse(message.value.toString());

//         console.log("Notification Service:", data);

//       } catch (err) {
//         console.error("Notification error:", err);
//       }
//     }
//   });
// }

// run();
require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: "consumer-2",
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({
  groupId: process.env.NOTIFICATION_GROUP
});

async function run() {
  await consumer.connect();

  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC,
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        console.log("Notification Service:", data);
      } catch (err) {
        console.error("Error:", err);
      }
    }
  });
}

run();