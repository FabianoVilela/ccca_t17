import Account from './Acccoun';
import DatabaseConnection from './DatabaseConnection';

export default interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(id: string): Promise<Account>;
  saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {
  }

  async getAccountByEmail(email: string): Promise<Account | undefined> {
    const [accountData] = await this.connection.query(
      'SELECT * FROM cccat17.account WHERE email = $1',
      [email],
    );

    if (!accountData) return;

    const account = new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate
    );

    return account;
  }

  async getAccountById(id: string): Promise<Account>{
    const [accountData] = await this.connection.query(
      'SELECT * FROM cccat17.account WHERE account_id = $1',
      [id],
    );

    if (!accountData) throw new Error('Account not found!');

    const account = new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate
    );

    return account;
  }

  async saveAccount(account: any) {
    const insetQuery =
      'insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)';

    await this.connection.query(insetQuery, [
      account.accountId,
      account.name,
      account.email,
      account.getCpf(),
      account.carPlate,
      !!account.isPassenger,
      !!account.isDriver,
    ]);
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[];

  constructor() {
    this.accounts = [];
  }

  async getAccountByEmail(email: string): Promise<Account | undefined> {
    return this.accounts.find((acc) => acc.email === email.toLowerCase());
  }

  async getAccountById(id: string): Promise<Account> {
    const account = this.accounts.find((acc) => acc.accountId === id);

    if(!account) throw new Error('Account not found!');
    return account;
  }

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
