import axios from 'axios';

axios.defaults.validateStatus = function () {
  return true;
};

const BASE_URL = 'http://localhost:3000';

test('Should create an account for the passenger by API', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '97456321558',
    isPassenger: true,
    isDriver: false,
  };

  const responseSignup = await axios.post(`${BASE_URL}/signup`, input);
  const outputSignup = responseSignup.data;

  expect(outputSignup.accountId).toBeDefined();

  const responseGetAccount = await axios.get(
    `${BASE_URL}/accounts/${outputSignup.accountId}`,
  );
  const outputGetAccount = responseGetAccount.data;

  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
});

test('Should not create a passenger account with invalid CPF by API', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@email.com`,
    cpf: '974563215580',
    isPassenger: true,
    isDriver: false,
  };

  const responseSignup = await axios.post(`${BASE_URL}/signup`, input);
  const outputSignup = responseSignup.data;

  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe('Invalid CPF!');
});
