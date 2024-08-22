import RequestRide from '../../application/usecases/ride/RequestRide';
import Queue from '../queues/Queue';

export default class QueueController {
  constructor(
    readonly queue: Queue,
    readonly requestRide: RequestRide,
  ) {
    queue.consume('requestRide', async (input: any) => {
      await requestRide.execute(input);
    });
  }
}
