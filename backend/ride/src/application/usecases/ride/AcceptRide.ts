import AccountGateway from '../../gateways/AccountGateway';
import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Input = {
  rideId: string;
  driverId: string;
};

export default class AcceptRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(input: Input): Promise<void> {
    // NOTE: Application business rules
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(
      input.driverId,
    );
    if (hasActiveRide) throw new Error('This driver has an active ride');

    const account = await this.accountGateway.getById(input.driverId);

    // NOTE: Enterprise business rules
    const ride = await this.rideRepository.getById(input.rideId);

    ride.accept(account);

    await this.rideRepository.updateRide(ride);
  }
}
