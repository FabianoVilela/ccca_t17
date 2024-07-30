import axios from 'axios';

axios.defaults.validateStatus = function () {
  return true;
};

const BASE_URL = 'http://localhost:3000';

test('You must create a passenger account through the API', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    password: '123456',
    isPassenger: true,
    isDriver: false,
  };
  const responseSignup = await axios.post(`${BASE_URL}/signup`, inputSignup);
  const outputSignup = responseSignup.data;

  expect(outputSignup.accountId).toBeDefined();

  const responseGetAccount = await axios.get(
    `${BASE_URL}/accounts/${outputSignup.accountId}`,
  );
  const outputGetAccount = responseGetAccount.data;

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});
