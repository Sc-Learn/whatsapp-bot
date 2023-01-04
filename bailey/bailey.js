const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@adiwajshing/baileys');

const ack = {
  error: 0,
  pending: 1,
  server: 2,
  delivered: 3,
  read: 4,
  played: 5
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

let client;
const listMessageStatus = new Map();
async function connectToWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')

  client = makeWASocket({
    printQRInTerminal: true,
    auth: state
  })

  client.ev.on ('creds.update', saveCreds)

  client.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if(connection === 'close') {
          const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
          console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)

          // reconnect if not logged out
          if(shouldReconnect) {
              connectToWhatsApp()
          } else {
            console.log("Client logout");
          }
      } else if(connection === 'open') {
          console.log('opened connection')
      }
  })

  client.ev.on('messages.update', (messages) => {
    for (const message of messages) {
      messageStatusIsExist = listMessageStatus.has(message.key.id)
      if (messageStatusIsExist) {
        listMessageStatus.set(message.key.id, message.update.status)
      }
    }
  });
}
connectToWhatsApp()

module.exports = {
  sendMessage: async(payload) => {
    const message = await client.sendMessage(`${payload.phoneNumber}@c.us`, { text: payload.message })
    listMessageStatus.set(message.key.id, message.status)

    setTimeout(async () => {
      const status = listMessageStatus.get(message.key.id) 
      const messageStatus = getKeyByValue(ack, status)
      console.log(`${message.key.id} messageStatus = ${messageStatus} ${new Date()}`);
      listMessageStatus.delete(message.key.id)
    }, 5000);
  }
}