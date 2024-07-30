import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';
import ProcessPayment from '../payment/ProcessPayment';

export default class FinishRide implements UseCase {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    ride.finish();

    await this.rideRepository.updateRide(ride);

    const processPayment = new ProcessPayment();
    await processPayment.execute({ rideId: ride.rideId, amount: ride.fare });
  }
}

type Input = {
  rideId: string;
};
