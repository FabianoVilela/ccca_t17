import SuperRideRepository from '../../repositories/SuperRideRepository';
import UseCase from '../UseCase';

type Output = {
  rideId: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  passengerName: string;
};

export default class GetSuperRide implements UseCase {
  constructor(readonly rideRepository: SuperRideRepository) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId);

    return {
      rideId: ride.rideId,
      passengerId: ride.passenger.accountId,
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      status: ride.status,
      date: ride.date,
      passengerName: ride.getPassengerName(),
    };
  }
}
