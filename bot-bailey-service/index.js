const topic = "send-whatsapp";

(async () => {
    const { sendMessage } = require('./bailey')
    const { createConsumer } = require('./kafka')

    const consumer = await createConsumer(async ({_, value}) => {
        const v = JSON.parse(value)
        console.log(`Consumed event from topic ${topic}: value = ${value}`);
        await sendMessage(v)
    });

    consumer.subscribe([topic]);
  
    const tickerWithRandomDelay = () => {
        const min = 5;
        const max = 10;
        const randomDelay = Math.floor(Math.random() * (max - min + 1) + min);

        consumer.consume(1);
        console.log('Wait for ' + randomDelay + ' seconds');
        setTimeout(tickerWithRandomDelay, randomDelay * 1000);
    }

    tickerWithRandomDelay();
})()
  .catch(err => {
    console.warn(err);
  })