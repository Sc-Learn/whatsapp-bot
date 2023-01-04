# Demo Whatsapp Bot

## How To Run
Start container kafka
```sh
cd  regis-server && sudo docker-compose up -d && cd ../
```

Install all dependencies
```sh
npm run install
```

*you must choose one, running bailey or whatsapp-web-js*

running whatsapp bot (bailey)
```sh
npm run start-bailey
# if there is no session, you must scan QR code to authentication
```

running whatsapp bot (whatsapp-web-js)
```sh
npm run start-wwebjs
# if there is no session, you must scan QR code to authentication
```

## How To Use
**Using HTTP**
1. Hit endpoint `http://localhost:3000/registration/axios`, with request body `phoneNumber: <YourPhoneNumber>`
2. Expected Will get whatsapp message

**Using Kafka**
1. Hit endpoint `http://localhost:3000/registration/kafka`, with request body `phoneNumber: <YourPhoneNumber>`
2. Expected Will get whatsapp message
