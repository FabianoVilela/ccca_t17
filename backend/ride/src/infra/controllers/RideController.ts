import RequestRide from '../../application/usecases/ride/RequestRide';
import HttpServer from '../http/HttpServer';
import Queue from '../queues/Queue';

export default class RideController {
  constructor(
    readonly httpServer: HttpServer,
    readonly requestRide: RequestRide,
    readonly queue: Queue,
  ) {
    httpServer.register('post', '/request_ride', async (params: any, body: any) => {
      const response = await requestRide.execute(body);
      // biome-ignore lint/suspicious/noConsoleLog: Will be implemented in the future
      console.log('RideController response =>', response);

      return response;
    });

    // NOTE
    // very large volume of requests, which have many dependencies on other microservices...
    // + scalability, resilience, independence, and maintainability

    // command/handler
    // httpServer.register('post', '/request_ride_async', async (params: any, body: any) => {
    //   // command - intention to execute
    //   await queue.publish('requestRide', body);
    // });
  }
}
