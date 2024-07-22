import Ride from '../../../domain/entities/Ride';
import AccountRepository from '../../repositories/AccountRepository';
import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};

export default class RequestRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    // NOTE: Application business rules
    const account = await this.accountRepository.getById(input.passengerId);
    if (!account.isPassenger) throw new Error('This account is not from passenger');

    const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(
      input.passengerId,
    );
    if (hasActiveRide) throw new Error('This passenger has an active ride');

    // NOTE: Enterprise business rules
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    );

    await this.rideRepository.save(ride);

    return {
      rideId: ride.rideId,
    };
  }
}
