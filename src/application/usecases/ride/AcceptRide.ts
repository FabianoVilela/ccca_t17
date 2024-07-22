import AccountRepository from '../../repositories/AccountRepository';
import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Input = {
  rideId: string;
  driverId: string;
};

export default class AcceptRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    // NOTE: Application business rules
    const account = await this.accountRepository.getById(input.driverId);

    if (!account.isDriver) throw new Error();

    // NOTE: Enterprise business rules
    const ride = await this.rideRepository.getById(input.rideId);
    ride.accept(input.driverId);

    await this.rideRepository.save(ride);
  }
}
