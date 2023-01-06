const Kafka = require('node-rdkafka');
const groupId = "whatsapp-bot";
const brokers = ["localhost:9092"];

module.exports = {
  createConsumer: (onData) => {
    const consumer = new Kafka.KafkaConsumer(
      {
          'bootstrap.servers': brokers,
          'group.id': groupId
        },
      {'auto.offset.reset': 'earliest'}
    );

    return new Promise((resolve, reject) => {
      consumer
      .on('ready', () => resolve(consumer))
      .on('data', onData);

      consumer.connect();
    });
  }
}