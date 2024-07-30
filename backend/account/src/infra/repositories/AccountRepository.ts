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
      accountData.password,
      accountData.password_type,
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
      accountData.password,
      accountData.password_type,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
    );

    return account;
  }

  async save(account: any) {
    const insetQuery =
      'INSERT INTO cccat17.account (account_id, name, email, cpf, password, password_type, is_passenger, is_driver, car_plate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

    await this.connection.query(insetQuery, [
      account.accountId,
      account.getName(),
      account.getEmail(),
      account.getCpf(),
      account.getPassword(),
      account.passwordType,
      !!account.isPassenger,
      !!account.isDriver,
      account.getCarPlate(),
    ]);
  }

  async list() {
    const accountsData = await this.connection.query('SELECT * FROM cccat17.account', []);
    const accounts: Account[] = [];

    for (const accountData of accountsData) {
      accounts.push(
        new Account(
          accountData.account_id,
          accountData.name,
          accountData.email,
          accountData.cpf,
          accountData.password,
          accountData.password_type,
          accountData.is_passenger,
          accountData.is_driver,
          accountData.car_plate,
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
