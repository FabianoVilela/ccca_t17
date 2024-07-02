import pgp from 'pg-promise';

export default interface AccountDAO {
  getAccountByEmail(email: string): Promise<any>;
  getAccountById(id: string): Promise<any>;
  saveAccount(account: any): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {
  async getAccountByEmail(email: string) {
    const connection = pgp()('postgres://postgres:docker@localhost:5432/app');

    const [account] = await connection.query(
      'SELECT * FROM cccat17.account WHERE email = $1',
      [email],
    );

    connection.$pool.end();

    return account;
  }

  async getAccountById(id: string) {
    const connection = pgp()('postgres://postgres:docker@localhost:5432/app');

    const [account] = await connection.query(
      'SELECT * FROM cccat17.account WHERE account_id = $1',
      [id],
    );

    connection.$pool.end();

    return { ...account, ...{ carPlate: account.car_plate } };
  }

  async saveAccount(account: any) {
    const connection = pgp()('postgres://postgres:docker@localhost:5432/app');
    const insetQuery =
      'insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)';

    const { accountId, name, email, cpf, carPlate, isDriver, isPassenger } = account;

    await connection.query(insetQuery, [
      accountId,
      name,
      email,
      cpf,
      carPlate,
      !!isPassenger,
      !!isDriver,
    ]);

    connection.$pool.end();
  }
}

export class AccountDAOMemory implements AccountDAO {
  accounts: any[];

  constructor() {
    this.accounts = [];
  }

  async getAccountByEmail(email: string): Promise<any> {
    return this.accounts.find((acc) => acc.email === email.toLowerCase());
  }

  async getAccountById(id: string): Promise<any> {
    return this.accounts.find((acc) => acc.accountId === id);
  }

  async saveAccount(account: any): Promise<void> {
    this.accounts.push(account);
  }
}
