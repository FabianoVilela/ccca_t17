import sinon from 'sinon';
import MailerGateway from '../../src/application/gateways/MailerGateway';
import GetAccount from '../../src/application/usecases/account/GetAccount';
import Signup from '../../src/application/usecases/account/Signup';
import Account from '../../src/domain/entities/Account';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../../src/infra/databases/DatabaseConnection';
import MailerGatewayFake from '../../src/infra/gateways/MailerGatewayFake';
import {
  AccountRepositoryDatabase,
  AccountRepositoryMemory,
} from '../../src/infra/repositories/AccountRepository';

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: DatabaseConnection;
let mailerGateway: MailerGateway;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  mailerGateway = new MailerGatewayFake();
  signup = new Signup(accountRepository, mailerGateway);
  getAccount = new GetAccount(accountRepository);
});

test('Should create an account for the passenger', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
});

test('Should create an account for the driver', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  };

  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.carPlate).toBe(input.carPlate);
});

test('Should not create a passenger account with invalid name', async function () {
  const input = {
    name: '',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  await expect(() => signup.execute(input)).rejects.toThrowError('Invalid name!');
});

test('Should not create a passenger account with invalid e-mail', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  await expect(() => signup.execute(input)).rejects.toThrowError('Invalid e-mail!');
});

test('Should not create a passenger account with invalid CPF', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '9745632155',
    isPassenger: true,
    isDriver: false,
  };

  await expect(() => signup.execute(input)).rejects.toThrowError('Invalid CPF!');
});

test('Should not create a passenger account with duplicated e-mail', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrowError(
    'Account already exists!',
  );
});

test('Should not create a driver account with invalid car plate', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC123',
  };

  await expect(() => signup.execute(input)).rejects.toThrowError('Invalid car plate!');
});

test('Should create a passenger account with MailerGateway stub', async function () {
  const stub = sinon.stub(mailerGateway, 'send').resolves();
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
  stub.restore();
});

test('Should create a passenger account with AccountRepository stub', async function () {
  const email = `john.doe${Math.random()}@gmail.com`;
  const inputSignup = {
    name: 'John Doe',
    email,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };
  const inputSignupStup = Account.create('John Doe', email, '97456321558', true, false);

  const stubSaveAccount = sinon
    .stub(AccountRepositoryDatabase.prototype, 'save')
    .resolves();
  const stubGetAccountByEmail = sinon
    .stub(AccountRepositoryDatabase.prototype, 'getByEmail')
    .resolves(undefined);
  const stubGetAccountById = sinon
    .stub(AccountRepositoryDatabase.prototype, 'getById')
    .resolves(inputSignupStup);

  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);

  stubSaveAccount.restore();
  stubGetAccountByEmail.restore();
  stubGetAccountById.restore();
});

test('Should create a passenger account with fake AccountRepository', async function () {
  const accountRepository = new AccountRepositoryMemory();
  signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository);

  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test('Should create a passenger account with MailerGateway spy', async function () {
  const spySend = sinon.spy(mailerGateway, 'send');

  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
  expect(spySend.calledOnce).toBe(true);
  expect(spySend.calledWith(inputSignup.email, 'Welcome!', '')).toBe(true);
  spySend.restore();
});

test('Should create a passenger account with MailerGateway mock', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const mockMailerGateway = sinon.mock(mailerGateway);
  mockMailerGateway
    .expects('send')
    .withArgs(inputSignup.email, 'Welcome!', '')
    .once()
    .callsFake(() => {
      // biome-ignore lint/suspicious/noConsoleLog: Just for testing purposes
      console.log('Sent');
    });

  const outputSignup = await signup.execute(inputSignup);

  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);

  mockMailerGateway.verify();
  mockMailerGateway.restore();
});

afterEach(async () => {
  await databaseConnection.close();
});
