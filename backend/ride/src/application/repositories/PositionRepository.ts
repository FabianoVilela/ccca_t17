import Position from '../../domain/entities/Position';

export default interface PositionRepository {
  savePosition(position: Position): Promise<void>;
  getLastPositionFromRideId(rideId: string): Promise<Position | undefined>;
}
