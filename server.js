// const express = require('express');
// const { Kafka } = require('kafkajs');

// const app = express();
// app.use(express.json());

// const kafka = new Kafka({
//   clientId: 'mern-app',
//   brokers: ['localhost:9092']
// });

// const producer = kafka.producer();

// async function startServer() {
//   await producer.connect();

//   app.post('/order', async (req, res) => {
//     const order = {
//       id: Date.now(),
//       product: req.body.product,
//       price: req.body.price
//     };

//     await producer.send({
//       topic: 'orders',
//       messages: [{ value: JSON.stringify(order) }]
//     });

//     console.log("Order sent:", order);

//     res.json({ message: "Order sent", order });
//   });

//   app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
//   });
// }

// startServer();

//New COde With Limitiation
// const express = require('express');
// const { Kafka } = require('kafkajs');

// const app = express();
// app.use(express.json());

// const kafka = new Kafka({
//   clientId: 'mern-app',
//   brokers: ['localhost:9092'],
//   retry: {
//     retries: 5,              // Retry if fail
//     initialRetryTime: 300
//   }
// });

// const producer = kafka.producer();

// async function startServer() {
//   await producer.connect();

//   app.post('/order', async (req, res) => {
//     try {
//       const order = {
//         id: Date.now(),
//         userId: req.body.userId || "user1",
//         product: req.body.product,
//         price: req.body.price
//       };

//       await producer.send({
//         topic: 'orders',
//         acks: -1, // wait for all replicas
//         messages: [
//           {
//             key: order.userId, // ensures ordering per user
//             value: JSON.stringify(order)
//           }
//         ]
//       });

//       console.log("Order sent:", order);

//       res.json({ message: "Order sent", order });

//     } catch (err) {
//       console.error("Producer Error:", err);
//       res.status(500).send("Error sending order");
//     }
//   });

//   app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
//   });
// }

// // startServer();

//-------------------------------------------------
// ***************Backup Code***************
//--------------------------------------------------
// require('dotenv').config();

// const express = require('express');
// const { Kafka } = require('kafkajs');

// const app = express();
// app.use(express.json());

// const processedKeys = new Set();

// const kafka = new Kafka({
//   clientId: 'mern-app',
//   brokers: [process.env.KAFKA_BROKER]
// });

// const producer = kafka.producer();


// async function startServer() {
//   await producer.connect();

//   app.post('/order', async (req, res) => {
//     try {
//       const order = {
//         id: Date.now(),
//         userId: req.body.userId || "user1",
//         product: req.body.product,
//         price: req.body.price
//       };

//       await producer.send({
//         topic: process.env.KAFKA_TOPIC,
//         acks: -1,
//         messages: [
//           {
//             key: order.userId,
//             value: JSON.stringify(order)
//           }
//         ]
//       });

//       console.log("Order sent:", order);

//       res.json({ message: "Order sent", order });

//     } catch (err) {
//       console.error("Producer Error:", err);
//       res.status(500).send("Error sending order");
//     }
//   });

//   app.listen(process.env.PORT, () => {
//     console.log(`Server running on http://localhost:${process.env.PORT}`);
//   });
// }

// startServer();

require('dotenv').config();

const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const processedKeys = new Set();

const kafka = new Kafka({
  clientId: 'mern-app',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();


async function startServer() {
  await producer.connect();
  app.post('/order', async (req, res) => {
    try{
    const { userId, product, price, idempotencyKey } = req.body;

    // ❌ No key provided
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency key required" });
    }

    // ✅ Duplicate request check
    if (processedKeys.has(idempotencyKey)) {
      return res.json({ message: "Duplicate request ignored" });
    }

    // Mark key as used
    processedKeys.add(idempotencyKey);

    const order = {
      id: Date.now(),
      userId,
      product,
      price
    };

    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      acks: -1,
      messages: [
        {
          key: userId,
          value: JSON.stringify(order)
        }
      ]
    });

    console.log("Order sent:", order);

    res.json({ message: "Order sent", order });
    } catch (err) {
      console.error("Producer Error:", err);
      res.status(500).send("Error sending order");
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}

startServer();
