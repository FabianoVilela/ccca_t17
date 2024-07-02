import crypto from 'crypto';

import MailerGateway from './MailerGateway';
import AccountDAO from './resource';
import { validateCarPlate, validateCpf, validateEmail, validateName } from './utils';

export default interface AccountService {
  signup(input: any): Promise<any>;
  getAccount(accountId: any): Promise<any>;
}

export class AccountServiceProduction implements AccountService {
  accountDAO: AccountDAO;
  mailerGateway: MailerGateway;

  constructor(accountDAO: AccountDAO) {
    this.accountDAO = accountDAO;
    this.mailerGateway = new MailerGateway();
  }

  async signup(input: any): Promise<any> {
    const account = {
      accountId: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      carPlate: input.carPlate,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
    };

    const isValidName = validateName(account.name);
    const isValidCpf = validateCpf(account.cpf);
    const isValidEmail = validateEmail(account.email);
    const isValidCarPlate = validateCarPlate(account.carPlate);

    if (!isValidName) throw new Error('Invalid name!');
    if (!isValidEmail) throw new Error('Invalid e-mail!');
    if (!isValidCpf) throw new Error('Invalid CPF!');

    const emailExists = await this.accountDAO.getAccountByEmail(account.email);

    if (emailExists) throw new Error('Account already exists!');
    if (account.isDriver && !isValidCarPlate) throw new Error('Invalid car plate!');

    await this.accountDAO.saveAccount(account);
    await this.mailerGateway.send(account.email, 'Welcome!', '');

    return {
      accountId: account.accountId,
    };
  }

  async getAccount(accountId: string): Promise<any> {
    return await this.accountDAO.getAccountById(accountId);
  }
}
