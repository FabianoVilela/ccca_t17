import sinon from 'sinon';
import MailerGateway from '../src/MailerGateway';
import AccountService, { AccountServiceProduction } from '../src/application';
import { AccountDAODatabase, AccountDAOMemory } from '../src/resource';

let accountService: AccountService;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  accountService = new AccountServiceProduction(accountDAO);
});

test('Should create an account for the passenger', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const outputSignup = await accountService.signup(input);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
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

  const outputSignup = await accountService.signup(input);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
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

  await expect(() => accountService.signup(input)).rejects.toThrowError('Invalid name!');
});

test('Should not create a passenger account with invalid e-mail', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  await expect(() => accountService.signup(input)).rejects.toThrowError(
    'Invalid e-mail!',
  );
});

test('Should not create a passenger account with invalid CPF', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '9745632155',
    isPassenger: true,
    isDriver: false,
  };

  await expect(() => accountService.signup(input)).rejects.toThrowError('Invalid CPF!');
});

test('Should not create a passenger account with duplicated e-mail', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  await accountService.signup(input);
  await expect(() => accountService.signup(input)).rejects.toThrowError(
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

  await expect(() => accountService.signup(input)).rejects.toThrowError(
    'Invalid car plate!',
  );
});

test('Should create a passenger account with MailerGateway stub', async function () {
  const stub = sinon.stub(MailerGateway.prototype, 'send').resolves();
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  };

  const outputSignup = await accountService.signup(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
  stub.restore();
});

test('Should create a passenger account with AccountDAO stub', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  };
  const stubSaveAccount = sinon
    .stub(AccountDAODatabase.prototype, 'saveAccount')
    .resolves();
  const stubGetAccountByEmail = sinon
    .stub(AccountDAODatabase.prototype, 'getAccountByEmail')
    .resolves(undefined);
  const stubGetAccountById = sinon
    .stub(AccountDAODatabase.prototype, 'getAccountById')
    .resolves(inputSignup);

  const outputSignup = await accountService.signup(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);

  stubSaveAccount.restore();
  stubGetAccountByEmail.restore();
  stubGetAccountById.restore();
});

test('Should create a passenger account with fake AccountDAO', async function () {
  accountService = new AccountServiceProduction(new AccountDAOMemory());
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  };

  const outputSignup = await accountService.signup(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test('Should create a passenger account with MailerGateway spy', async function () {
  const spySend = sinon.spy(MailerGateway.prototype, 'send');

  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  };

  const outputSignup = await accountService.signup(inputSignup);
  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
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
  };

  const mockMailerGateway = sinon.mock(MailerGateway.prototype);
  mockMailerGateway
    .expects('send')
    .withArgs(inputSignup.email, 'Welcome!', '')
    .once()
    .callsFake(() => {
      console.log('Sent'); // TODO: Remove
    });

  const outputSignup = await accountService.signup(inputSignup);

  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);

  mockMailerGateway.verify();
  mockMailerGateway.restore();
});
