type Input = {
  rideId: string;
  amount: number;
};

export default class ProcessPayment {
  constructor() {}

  async execute(input: Input): Promise<void> {
    // biome-ignore lint/suspicious/noConsoleLog: Will be implemented in the next class
    console.log(input); // TODO: Implement this
  }
}
