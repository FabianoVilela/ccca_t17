import AccountRepository from '../../application/repositories/AccountRepository';
import Account from '../../domain/entities/Account';
import DatabaseConnection from '../databases/DatabaseConnection';

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getByEmail(email: string): Promise<Account | undefined> {
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
      accountData.car_plate,
    );

    return account;
  }

  async getById(id: string): Promise<Account> {
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
      accountData.car_plate,
    );

    return account;
  }

  async save(account: any) {
    const insetQuery =
      'insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)';

    await this.connection.query(insetQuery, [
      account.accountId,
      account.getName(),
      account.getEmail(),
      account.getCpf(),
      account.getCarPlate(),
      !!account.isPassenger,
      !!account.isDriver,
    ]);
  }

  async list() {
    const accountsData = await this.connection.query('select * from cccat17.account', []);
    const accounts: Account[] = [];

    for (const accountData of accountsData) {
      accounts.push(
        new Account(
          accountData.account_id,
          accountData.name,
          accountData.email,
          accountData.cpf,
          accountData.car_plate,
          accountData.is_passenger,
          accountData.is_driver,
        ),
      );
    }

    return accounts;
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[];

  constructor() {
    this.accounts = [];
  }

  async getByEmail(email: string): Promise<any> {
    return this.accounts.find(
      (account: Account) => account.getEmail() === email.toLowerCase(),
    );
  }

  async getById(accountId: string): Promise<any> {
    return this.accounts.find((account: Account) => account.accountId === accountId);
  }

  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async list(): Promise<Account[]> {
    return this.accounts;
  }
}
