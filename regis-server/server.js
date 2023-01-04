const Kafka = require('node-rdkafka');
const express = require('express')
const axios = require('axios')

const app = express()
const port = 3000
const groupId = "whatsapp-bot";
const brokers = ["localhost:9092"];
const topic = "send-whatsapp";

app.use(express.json());

function createProducer() {
  const producer = new Kafka.Producer({
    'bootstrap.servers': brokers,
    'group.id': groupId
  });

  return new Promise((resolve, reject) => {
    producer
      .on('ready', () => resolve(producer))
      .on('delivery-report', (err, report) => {
          if (err) {
            console.warn('Error producing', err)
          } else {
            const {topic, key, value} = report;
            let k = key.toString().padEnd(10, ' ');
            console.log(`Produced event to topic ${topic}: key = ${k} value = ${value}`);
          }
      })
      .on('event.error', (err) => {
        console.warn('event.error', err);
        reject(err);
      });

    producer.connect();
  });
}

(async () => {
  const producer = await createProducer();

  app.post('/registration/kafka', (req, res) => {
    if (!req.body?.phoneNumber) {
      res.status(400).json({ message: "phoneNumber is required" })
    }
  
    const value = {
      phoneNumber: req.body.phoneNumber,
      message: `Your OTP is ${Math.floor(1000 + Math.random() * 9000)}`
    }
    producer.produce(topic, -1, Buffer.from(JSON.stringify(value)), 'otpId-123123');
  
    res.status(200).json({ message: `Success regis with phone number ${req.body.phoneNumber}` })
  })
  
  app.post('/registration/axios', async (req, res) => {
    if (!req.body?.phoneNumber) {
      res.status(400).json({ message: "phoneNumber is required" })
    }
  
    const payload = {
      phoneNumber: req.body.phoneNumber,
      message: `Your OTP is ${Math.floor(1000 + Math.random() * 9000)}`
    }

    await axios.post('http://localhost:2003/send-otp', payload)

    res.status(200).json({ message: `Success regist with phone number ${req.body.phoneNumber}` })
  })
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})()
  .catch(err => {
    console.warn(err);
  })