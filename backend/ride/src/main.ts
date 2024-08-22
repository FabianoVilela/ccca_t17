import RequestRide from './application/usecases/ride/RequestRide';
import RideController from './infra/controllers/RideController';
import { PgPromiseAdapter } from './infra/databases/DatabaseConnection';
import Registry from './infra/di/Registry';
import AccountGatewayHttp from './infra/gateways/AccountGatewayHttp';
import { AxiosAdapter } from './infra/http/HttpClient';
import { ExpressAdapter, FastifyAdapter } from './infra/http/HttpServer';
import { RabbitMQAdapter } from './infra/queues/Queue';
import RideRepositoryDatabase from './infra/repositories/RideRepositoryDatabase';

// const httpServer = new FastifyAdapter();

// Registry.getInstance().provide('httpServer', httpServer);

// httpServer.listen(3001);

(async () => {
  const dbConnection = new PgPromiseAdapter();
  const httpServer = new FastifyAdapter();
  const rideRepository = new RideRepositoryDatabase(dbConnection);
  const httpClient = new AxiosAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  const requestRide = new RequestRide(rideRepository, accountGateway);
  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.setup('rideCompleted', 'rideCompleted.processPayment');

  new RideController(httpServer, requestRide, queue);

  httpServer.listen(3001);
})();
