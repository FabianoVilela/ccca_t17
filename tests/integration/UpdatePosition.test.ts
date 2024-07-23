import MailerGateway from '../../src/application/gateways/MailerGateway';
import Signup from '../../src/application/usecases/account/Signup';
import AcceptRide from '../../src/application/usecases/ride/AcceptRide';
import GetRide from '../../src/application/usecases/ride/GetRide';
import RequestRide from '../../src/application/usecases/ride/RequestRide';
import StartRide from '../../src/application/usecases/ride/StartRide';
import UpdatePosition from '../../src/application/usecases/ride/UpdatePosition';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../../src/infra/databases/DatabaseConnection';
import MailerGatewayFake from '../../src/infra/gateways/MailerGatewayFake';
import { AccountRepositoryDatabase } from '../../src/infra/repositories/AccountRepository';
import PositionRepositoryDatabase from '../../src/infra/repositories/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repositories/RideRepositoryDatabase';

let connection: DatabaseConnection;
let signup: Signup;
let mailerGateway: MailerGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  mailerGateway = new MailerGatewayFake();
  signup = new Signup(accountRepository, mailerGateway);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, accountRepository, positionRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
});

test('Should update the position of a race during business hours', async function () {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
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
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };

  const outputSignupDriver = await signup.execute(inputSignupDriver);
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

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.currentLat).toBe(-27.496887588317275);
  expect(outputGetRide.currentLong).toBe(-48.522234807851476);
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(21);
});

test('Should update the position of a race during night hours', async function () {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
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
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
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
    date: new Date('2023-03-01T23:00:00'),
  };
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date('2023-03-01T23:10:00'),
  };

  await updatePosition.execute(inputUpdatePosition1);
  await updatePosition.execute(inputUpdatePosition2);

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.currentLat).toBe(-27.496887588317275);
  expect(outputGetRide.currentLong).toBe(-48.522234807851476);
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(39);
});

test('Should update the position of a race during Sunday', async function () {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
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
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
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
    date: new Date('2021-03-07T10:00:00'),
  };

  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date('2021-03-07T10:10:00'),
  };

  await updatePosition.execute(inputUpdatePosition1);
  await updatePosition.execute(inputUpdatePosition2);

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.currentLat).toBe(-27.496887588317275);
  expect(outputGetRide.currentLong).toBe(-48.522234807851476);
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(50);
});

afterEach(async () => {
  await connection.close();
});
