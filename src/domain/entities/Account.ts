import CarPlate from '../vos/CarPlate';
import Cpf from '../vos/Cpf';
import Email from '../vos/Email';
import Name from '../vos/Name';
import Password, { PasswordFactory } from '../vos/Password';

export default class Account {
  private name: Name;
  private cpf: Cpf;
  private email: Email;
  private password: Password;
  private carPlate: CarPlate;

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    readonly passwordType: string = 'plain',
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    carPlate?: string,
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    this.password = PasswordFactory.create(password, passwordType);
    this.carPlate = new CarPlate(carPlate);
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    password: string,
    passwordType: string = 'plain',
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string,
  ): Account {
    const accountId = crypto.randomUUID();

    return new Account(
      accountId,
      name,
      email,
      cpf,
      password,
      passwordType,
      isPassenger,
      isDriver,
      carPlate,
    );
  }

  getName() {
    return this.name.getValue();
  }

  getCpf() {
    return this.cpf.getValue();
  }

  getEmail() {
    return this.email.getValue();
  }

  verifyPassword(password: string) {
    return this.password.verify(password);
  }

  getPassword() {
    return this.password.value;
  }

  getCarPlate() {
    return this.carPlate.getValue();
  }
}
