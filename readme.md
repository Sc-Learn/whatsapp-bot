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

```sh
cd regis-service && npm start && cd ../
cd bot-master-service && npm start && cd ../

cd bot-whatsapp-web-js-service && npm start && cd ../
# if there is no session, you must scan QR code to authentication

cd bot-bailey-service && npm start && cd ../
# if there is no session, you must scan QR code to authentication
```

OR

```sh
npm run start # in root folder
```


## How To Use
**Using HTTP**
1. Hit endpoint `http://localhost:3000/registration`, with request body `phoneNumber: <YourPhoneNumber>`
2. Expected Will get whatsapp message
