// NOTE: Account entity
type Input = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
};

type GetByIdOutput = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  passwordType: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
};

type SignupOutput = {
  accountId: string;
};

export default interface AccountGateway {
  signup(input: Input): Promise<SignupOutput>;
  getById(accountId: string): Promise<GetByIdOutput>;
}
