// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'consumer-app',
//   brokers: ['localhost:9092']
// });

// const consumer = kafka.consumer({ groupId: 'order-group' });

// async function run() {
//   await consumer.connect();

//   await consumer.subscribe({
//     topic: 'orders',
//     fromBeginning: true
//   });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const data = JSON.parse(message.value.toString());
//       console.log("Received Order:", data);
//     }
//   });
// }

// run();


//New Code
// const { Kafka } = require('kafkajs');
// const fs = require('fs');

// const kafka = new Kafka({
//   clientId: 'consumer-1',
//   brokers: ['localhost:9092']
// });

// const consumer = kafka.consumer({ groupId: 'order-group' });

// // Load processed IDs
// let processed = [];
// if (fs.existsSync('processed.json')) {
//   processed = JSON.parse(fs.readFileSync('processed.json'));
// }

// async function run() {
//   await consumer.connect();

//   await consumer.subscribe({
//     topic: 'orders',
//     fromBeginning: true
//   });

//   await consumer.run({
//     autoCommit: false, // manual commit

//     eachMessage: async ({ topic, partition, message }) => {
//       try {
//         const data = JSON.parse(message.value.toString());

//         // Idempotency check
//         if (processed.includes(data.id)) {
//           console.log("Duplicate skipped:", data.id);
//           return;
//         }

//         console.log("Processing Order:", data);

//         // Save processed ID
//         processed.push(data.id);
//         fs.writeFileSync('processed.json', JSON.stringify(processed));

//         // Commit offset AFTER success
//         await consumer.commitOffsets([
//           {
//             topic,
//             partition,
//             offset: (Number(message.offset) + 1).toString()
//           }
//         ]);

//       } catch (err) {
//         console.error("Error processing message:", err);
//       }
//     }
//   });
// }

// run();
require('dotenv').config();
const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
  clientId: "consumer-1",
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

let processed = [];
if (fs.existsSync('processed.json')) {
  processed = JSON.parse(fs.readFileSync('processed.json'));
}

async function run() {
  await consumer.connect();

  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC,
    fromBeginning: true
  });

  await consumer.run({
    autoCommit: false,

    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        if (processed.includes(data.id)) {
          console.log("Duplicate skipped:", data.id);
          return;
        }

        console.log("Processing Order:", data);

        processed.push(data.id);
        fs.writeFileSync('processed.json', JSON.stringify(processed));

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString()
          }
        ]);

      } catch (err) {
        console.error("Error:", err);
      }
    }
  });
}

run();