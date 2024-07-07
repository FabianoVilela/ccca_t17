import Cpf from "../src/Cpf";

test.each(['97456321558', '71428793860', '87748248800'])(
  'Should test if the CPF is valid %s',
  function (cpf: string) {
    expect(new Cpf(cpf)).toBeDefined();
  },
);

test.each(['', null, undefined, '123456', '12345678901234567890', '11111111111'])(
  'Should test if the CPF is invalid %s',
  function (cpf: any) {
    expect(() => new Cpf(cpf)).toThrowError('Invalid CPF!');
  },
);
