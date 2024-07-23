import Position from '../../../domain/entities/Position';
import PositionRepository from '../../repositories/PositionRepository';
import RideRepository from '../../repositories/RideRepository';
import UseCase from '../UseCase';

type Input = {
  rideId: string;
  lat: number;
  long: number;
  date: Date;
};

export default class UpdatePosition implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    const position = Position.create(input.rideId, input.lat, input.long, input.date);
    const lastPosition = await this.positionRepository.getLastPositionFromRideId(
      input.rideId,
    );

    if (lastPosition) ride.updatePosition(lastPosition, position);

    await this.positionRepository.savePosition(position);
    await this.rideRepository.updateRide(ride);
  }
}
