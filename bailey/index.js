const express = require('express')
const app = express()
const port = 2003
const topic = "send-whatsapp";

app.use(express.json());

(async () => {
    const { sendMessage } = require('./bailey')
    const { createConsumer } = require('./kafka')

      // Send otp by consuming topic 'send-whatsapp' from kafka
      const consumer = await createConsumer(async ({_, value}) => {
          const v = JSON.parse(value)
          console.log(`Consumed event from topic ${topic}: value = ${value}`);
          await sendMessage(v)
      });
  
      consumer.subscribe([topic]);
      consumer.consume();

      // send otp by http
      app.post('/send-otp', async (req, res) => {
          if (!req.body.phoneNumber && !req.body.message) {
            res.status(400).json({ message: "phoneNumber and message are required" })
          }
          await sendMessage(req.body)

          res.status(200).json({ message: `Success send OTP to ${req.body.phoneNumber}` })
      })

      app.listen(port, () => {
          console.log(`Listening on port ${port}`)
      })
  })()
    .catch(err => {
      console.warn(err);
    })