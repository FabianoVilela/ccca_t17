type Input = {
  rideId: string;
  amount: number;
};

export default class ProcessPayment {
  constructor() {}

  async execute(input: Input): Promise<void> {
    console.log(input); // TODO: Implement this
  }
}
