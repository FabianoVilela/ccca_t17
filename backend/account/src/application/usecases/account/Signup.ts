import Account from '../../../domain/entities/Account';
import MailerGatewayFake from '../../../infra/gateways/MailerGatewayFake';
import MailerGateway from '../../gateways/MailerGateway';
import AccountRepository from '../../repositories/AccountRepository';
import UseCase from '../UseCase';

type Input = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  passwordType?: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
};

type Output = {
  accountId: string;
};

export default class Signup implements UseCase {
  accountRepository: AccountRepository;
  mailerGateway: MailerGateway;

  // NOTE: Dependency Injection that enabled the Dependency Inversion (DIP) design principle
  constructor(
    accountRepository: AccountRepository,
    mailerGateway: MailerGateway = new MailerGatewayFake(),
  ) {
    this.accountRepository = accountRepository;
    this.mailerGateway = mailerGateway;
  }

  // NOTE: Dependency Injection that enabled the Dependency Inversion (DIP) design principle (alternative)
  // setAccountRepository(accountRepository: AccountRepository) {
  //   this.accountRepository = accountRepository;
  // }

  async execute(input: Input): Promise<Output> {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.password,
      (input.passwordType = 'plain'),
      input.isPassenger,
      input.isDriver,
      input.carPlate,
    );

    const emailExists = await this.accountRepository.getByEmail(account.getEmail());

    if (emailExists) throw new Error('Account already exists!');

    await this.accountRepository.save(account);
    await this.mailerGateway.send(account.getEmail(), 'Welcome!', '');

    return {
      accountId: account.accountId,
    };
  }
}
