import AccountRepository from '../../repositories/AccountRepository';
import PositionRepository from '../../repositories/PositionRepository';
import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Output = {
  rideId: string;
  passengerId: string;
  driverId: string;
  passengerName: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  currentLat?: number;
  currentLong?: number;
  distance: number;
  fare: number;
};

export default class GetRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId);
    const passenger = await this.accountRepository.getById(ride.passengerId);
    const lastPosition = await this.positionRepository.getLastPositionFromRideId(rideId);

    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      passengerName: passenger.getName(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      status: ride.status,
      date: ride.date,
      currentLat: lastPosition?.lat,
      currentLong: lastPosition?.long,
      distance: ride.distance,
      fare: ride.fare,
    };
  }
}
