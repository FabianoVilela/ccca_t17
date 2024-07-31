import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Input = {
  rideId: string;
};

export default class StartRide implements UseCase {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);

    ride.start();
    await this.rideRepository.updateRide(ride);
  }
}
