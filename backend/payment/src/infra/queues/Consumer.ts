import amqp from 'amqplib';

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  channel.consume('rideCompleted.processPayment', function (msg: any) {
    // biome-ignore lint/suspicious/noConsoleLog: This is a consumer, it's fine to log here
    console.log('processPayment', msg.content.toString());

    channel.ack(msg);
  });

  channel.consume('rideCompleted.sendReceipt', function (msg: any) {
    // biome-ignore lint/suspicious/noConsoleLog: This is a consumer, it's fine to log here
    console.log('sendReceipt', msg.content.toString());

    channel.ack(msg);
  });

  channel.consume('rideCompleted.generateInvoice', function (msg: any) {
    // biome-ignore lint/suspicious/noConsoleLog: This is a consumer, it's fine to log here
    console.log('generateInvoice', msg.content.toString());

    channel.ack(msg);
  });
})();
