import ProcessPayment from '../../application/usecases/payment/ProcessPayment';
import Queue from '../queues/Queue';

export default class QueueController {
  constructor(
    readonly queue: Queue,
    readonly processPayment: ProcessPayment,
  ) {
    queue.consume('rideCompleted.processPayment', async (input: any) => {
      await processPayment.execute(input);
    });
  }
}
