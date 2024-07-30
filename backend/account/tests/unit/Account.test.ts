import Account from '../../src/domain/entities/Account';

test('Should create an account with a plain password', function () {
  const account = Account.create(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    '123456',
    'plain',
    false,
    true,
    'ABC12334',
  );

  expect(account.verifyPassword('123456')).toBe(true);
});

test('Should create an account with a md5 password', function () {
  const account = Account.create(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    '123456',
    'md5',
    false,
    true,
    'ABC12334',
  );

  expect(account.verifyPassword('123456')).toBe(true);
});

test('Should create an account with a sha1 password', function () {
  const account = Account.create(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    '123456',
    'sha1',
    false,
    true,
    'ABC12334',
  );

  expect(account.verifyPassword('123456')).toBe(true);
});

test('Should create an account with a sha256 password', function () {
  const account = Account.create(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    '123456',
    'sha256',
    false,
    true,
    'ABC12334',
  );

  expect(account.verifyPassword('123456')).toBe(true);
});
