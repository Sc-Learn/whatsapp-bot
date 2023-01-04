const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const ack = {
  error: -1,
  pending: 0,
  server: 1,
  device: 2,
  read: 3,
  played: 4
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.initialize();

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessful
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

module.exports = { 
  client,
  sendMessage: async(payload) => {
    const message = await client.sendMessage(`${payload.phoneNumber}@c.us`, payload.message)

    setTimeout(async () => {
        const updatedMessage = await message.reload() 
        const messageStatus = getKeyByValue(ack, updatedMessage.ack)
        console.log(`${updatedMessage.id.id} messageStatus = ${messageStatus}`);
    }, 5000);
  }
 };