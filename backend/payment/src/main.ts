import ProcessPayment from './application/usecases/payment/ProcessPayment';
import PaymentController from './infra/controllers/PaymentController';
import QueueController from './infra/controllers/QueueController';
import { FastifyAdapter } from './infra/http/HttpServer';
import { RabbitMQAdapter } from './infra/queues/Queue';

(async () => {
  const httpServer = new FastifyAdapter();

  const processPayment = new ProcessPayment();
  new PaymentController(httpServer, processPayment);

  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.setup('rideCompleted', 'rideCompleted.processPayment');
  new QueueController(queue, processPayment);

  httpServer.listen(3002);
})();
