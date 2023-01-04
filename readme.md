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
```

running whatsapp bot (whatsapp-web-js)
```sh
npm run start-wwebjs
```
