import { validateCarPlate, validateEmail, validateName } from "./utils";
import Cpf from "./Cpf";

export default class Account {
  private cpf: Cpf;

  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate?: string
  ){
    if (!name) throw new Error('Invalid name!');
    if (!email) throw new Error('Invalid e-mail!');
    
    this.cpf = new Cpf(cpf);

    const isValidName = validateName(name);
    const isValidEmail = validateEmail(email);
    const isValidCarPlate = validateCarPlate(carPlate);
    
    if (!isValidName) throw new Error('Invalid name!');
    if (!isValidEmail) throw new Error('Invalid e-mail!');
    if (isDriver && !isValidCarPlate) throw new Error('Invalid car plate!');
  }

  static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string): Account {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
  }

  getCpf() {
    return this.cpf.getValue();
  }
}