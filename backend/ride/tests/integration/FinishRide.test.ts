import AccountGateway from '../../src/application/gateways/AccountGateway';
import AcceptRide from '../../src/application/usecases/ride/AcceptRide';
import FinishRide from '../../src/application/usecases/ride/FinishRide';
import GetRide from '../../src/application/usecases/ride/GetRide';
import RequestRide from '../../src/application/usecases/ride/RequestRide';
import StartRide from '../../src/application/usecases/ride/StartRide';
import UpdatePosition from '../../src/application/usecases/ride/UpdatePosition';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../../src/infra/databases/DatabaseConnection';
import AccountGatewayHttp from '../../src/infra/gateways/AccountGatewayHttp';
import PaymentGatewayHttp from '../../src/infra/gateways/PaymentGatewayHttp';
import { AxiosAdapter } from '../../src/infra/http/HttpClient';
import Mediator from '../../src/infra/madiators/Mediator';
import Queue, { RabbitMQAdapter } from '../../src/infra/queues/Queue';
import PositionRepositoryDatabase from '../../src/infra/repositories/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repositories/RideRepositoryDatabase';

let dbConnection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let accountGateway: AccountGateway;
let finishRide: FinishRide;
let queue: Queue;

beforeEach(async () => {
  dbConnection = new PgPromiseAdapter();
  const httpClient = new AxiosAdapter();
  const rideRepository = new RideRepositoryDatabase(dbConnection);
  const positionRepository = new PositionRepositoryDatabase(dbConnection);

  accountGateway = new AccountGatewayHttp(httpClient);
  requestRide = new RequestRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository, accountGateway, positionRepository);
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
  queue = new RabbitMQAdapter();

  const mediator = new Mediator();
  // NOTE: Using mediator
  // mediator.register("rideCompleted", async function (data: any) {
  // 	await processPayment.execute(data);
  // 	await generateInvoice.execute(data);
  // });

  const paymentGateway = new PaymentGatewayHttp(httpClient);
  await queue.connect();

  finishRide = new FinishRide(rideRepository, mediator, paymentGateway, queue);
});

test('Should finish a ride', async function () {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    passwordType: 'plain',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    passwordType: 'plain',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };

  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };

  await startRide.execute(inputStartRide);

  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date('2023-03-01T10:00:00'),
  };

  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date('2023-03-01T10:10:00'),
  };

  await updatePosition.execute(inputUpdatePosition1);
  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };

  await finishRide.execute(inputFinishRide);

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);

  expect(outputGetRide.status).toBe('completed');
});

afterEach(async () => {
  await dbConnection.close();

  setTimeout(async () => {
    await queue.disconnect();
  }, 500);
});
