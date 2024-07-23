import MailerGatewayFake from '../../../infra/gateways/MailerGatewayFake';
import MailerGateway from '../../gateways/MailerGateway';
import AccountRepository from '../../repositories/AccountRepository';
import UseCase from '../UseCase';

type Output = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
};

export default class GetAccount implements UseCase {
  accountRepository: AccountRepository;
  mailerGateway: MailerGateway;

  constructor(accountDAO: AccountRepository) {
    this.accountRepository = accountDAO;
    this.mailerGateway = new MailerGatewayFake();
  }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getById(accountId);

    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      password: account.getPassword(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.getCarPlate(),
    };
  }
}
