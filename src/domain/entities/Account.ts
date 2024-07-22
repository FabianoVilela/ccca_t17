import CarPlate from '../vos/CarPlate';
import Cpf from '../vos/Cpf';
import Email from '../vos/Email';
import Name from '../vos/Name';

export default class Account {
  private name: Name;
  private cpf: Cpf;
  private carPlate: CarPlate;
  private email: Email;

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    carPlate?: string,
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.carPlate = new CarPlate(carPlate);
    this.cpf = new Cpf(cpf);
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string,
  ): Account {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
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

  getCarPlate() {
    return this.carPlate.getValue();
  }
}
