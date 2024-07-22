import Account from '../../../domain/entities/Account';
import MailerGatewayFake from '../../../infra/gateways/MailerGatewayFake';
import MailerGateway from '../../gateways/MailerGateway';
import AccountRepository from '../../repositories/AccountRepository';
import UseCase from '../UseCase';

type Input = {
  name: string;
  email: string;
  cpf: string;
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

  constructor(
    accountRepository: AccountRepository,
    mailerGateway: MailerGateway = new MailerGatewayFake(),
  ) {
    this.accountRepository = accountRepository;
    this.mailerGateway = mailerGateway;
  }

  async execute(input: Input): Promise<Output> {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
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
