import MailerGateway from './MailerGateway';
import AccountRepository from './AccountRepository';
import UseCase from './UseCase';

type Output = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
}

export default class GetAccount implements UseCase {
  accountRepository: AccountRepository;
  mailerGateway: MailerGateway;

  constructor(accountDAO: AccountRepository) {
    this.accountRepository = accountDAO;
    this.mailerGateway = new MailerGateway();
  }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getAccountById(accountId);

    return {
      accountId: account.accountId,
      name: account.name,
      email: account.email,
      cpf: account.getCpf(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.carPlate,
    };
  }
}
