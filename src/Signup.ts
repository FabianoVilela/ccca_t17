import MailerGateway from './MailerGateway';
import AccountRepository from './AccountRepository';
import UseCase from './UseCase';
import Account from './Acccoun';

export default class Signup implements UseCase {
  accountRepository: AccountRepository;
  mailerGateway: MailerGateway;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
    this.mailerGateway = new MailerGateway();
  }

  async execute(input: any): Promise<any> {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate
    );

    const emailExists = await this.accountRepository.getAccountByEmail(account.email);
    if (emailExists) throw new Error('Account already exists!');

    await this.accountRepository.saveAccount(account);
    await this.mailerGateway.send(account.email, 'Welcome!', '');

    return {
      accountId: account.accountId,
    };
  }
}
