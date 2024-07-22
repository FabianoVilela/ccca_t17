import MailerGateway from '../../src/application/gateways/MailerGateway';
import Signup from '../../src/application/usecases/account/Signup';
import GetRide from '../../src/application/usecases/ride/GetRide';
import RequestRide from '../../src/application/usecases/ride/RequestRide';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../../src/infra/databases/DatabaseConnection';
import MailerGatewayFake from '../../src/infra/gateways/MailerGatewayFake';
import { AccountRepositoryDatabase } from '../../src/infra/repositories/AccountRepository';
import RideRepositoryDatabase from '../../src/infra/repositories/RideRepositoryDatabase';

let connection: DatabaseConnection;
let signup: Signup;
let mailerGateway: MailerGateway;
let requestRide: RequestRide;
let getRide: GetRide;

beforeAll(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);

  mailerGateway = new MailerGatewayFake();
  signup = new Signup(accountRepository, mailerGateway);

  const rideRepository = new RideRepositoryDatabase(connection);
  requestRide = new RequestRide(rideRepository, accountRepository);

  getRide = new GetRide(rideRepository);
});

test('Should request a ride', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await signup.execute(inputSignup);
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
    carPlate: 'ABC1234',
    isPassenger: false,
    isDriver: true,
  };
  const outputSignup = await signup.execute(inputSignup);

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
    isPassenger: true,
    isDriver: false,
  };
  const outputSignup = await signup.execute(inputSignup);
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
  await connection.close();
});
