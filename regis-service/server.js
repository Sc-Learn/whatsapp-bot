const express = require('express')
const axios = require('axios')

const app = express()
const port = 3000
const botMasterServiceBaseUrl = 'http://localhost:2003'

app.use(express.json());

(async () => {  
  app.post('/registration', async (req, res) => {
    if (!req.body?.phoneNumber) {
      res.status(400).json({ message: "phoneNumber is required" })
    }
  
    const payload = {
      phoneNumber: req.body.phoneNumber,
      message: `Your OTP is ${Math.floor(1000 + Math.random() * 9000)}`
    }

    await axios.post(`${botMasterServiceBaseUrl}/send-whatsapp`, payload)

    res.status(200).json({ message: `Success regis with phone number ${req.body.phoneNumber}, go check your whatsapp` })
  })
  
  app.listen(port, () => {
    console.log(`Regis service listening on port ${port}`)
  })
})()
  .catch(err => {
    console.warn(err);
  })