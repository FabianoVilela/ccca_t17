type Input = {
  rideId: string;
  amount: number;
};

export default class GenerateInvoice {
  constructor() {}

  async execute(input: Input): Promise<void> {
    // biome-ignore lint/suspicious/noConsoleLog: This is a sample code
    console.log('generateInvoice', input);
  }
}
