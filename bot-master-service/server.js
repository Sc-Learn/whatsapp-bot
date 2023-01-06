const Kafka = require('node-rdkafka');
const express = require('express')

const app = express()
const port = 2003
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

  app.post('/send-whatsapp', (req, res) => {
    if (!req.body.phoneNumber && !req.body.message) {
      res.status(400).json({ message: "phoneNumber and message are required" })
    }
  
    const value = {
      phoneNumber: req.body.phoneNumber,
      message: req.body.message
    }
    producer.produce(topic, -1, Buffer.from(JSON.stringify(value)));
  
    res.status(200).json({ message: `Success send whatsapp` })
  })
  
  app.listen(port, () => {
    console.log(`bot master service listening on port ${port}`)
  })
})()
  .catch(err => {
    console.warn(err);
  })