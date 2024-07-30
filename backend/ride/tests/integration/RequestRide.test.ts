import AccountGateway from '../../src/application/gateways/AccountGateway';
import GetRide from '../../src/application/usecases/ride/GetRide';
import RequestRide from '../../src/application/usecases/ride/RequestRide';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../../src/infra/databases/DatabaseConnection';
import AccountGatewayHttp from '../../src/infra/gateways/AccountGatewayHttp';
import { AxiosAdapter } from '../../src/infra/http/HttpClient';
import PositionRepositoryDatabase from '../../src/infra/repositories/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repositories/RideRepositoryDatabase';

let dbConnection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeAll(() => {
  dbConnection = new PgPromiseAdapter();
  const httpClient = new AxiosAdapter();
  accountGateway = new AccountGatewayHttp(httpClient);

  const rideRepository = new RideRepositoryDatabase(dbConnection);
  requestRide = new RequestRide(rideRepository, accountGateway);

  const positionRepository = new PositionRepositoryDatabase(dbConnection);
  requestRide = new RequestRide(rideRepository, accountGateway);

  getRide = new GetRide(rideRepository, accountGateway, positionRepository);
});

test('Should request a ride', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };

  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
  expect(outputGetRide.passengerName).toBe('John Doe');
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
  expect(outputGetRide.status).toBe('requested');
});

test('Should not be able to request a ride if the account is not a passenger', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };
  const outputSignup = await accountGateway.signup(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('This account is not from passenger'),
  );
});

test('Should not be able to request a ride if the passenger already has another unfinished ride', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: true,
    isDriver: false,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };

  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('This passenger has an active ride'),
  );
});

afterAll(async () => {
  await dbConnection.close();
});
