import Account from '../../domain/entities/Account';

export default interface AccountRepository {
  getByEmail(email: string): Promise<Account | undefined>;
  getById(accountId: string): Promise<Account>;
  save(account: Account): Promise<void>;
  list(): Promise<Account[]>;
}
