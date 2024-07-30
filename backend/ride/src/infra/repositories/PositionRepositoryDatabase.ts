import PositionRepository from '../../application/repositories/PositionRepository';
import Position from '../../domain/entities/Position';
import DatabaseConnection from '../databases/DatabaseConnection';

export default class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async savePosition(position: Position): Promise<void> {
    await this.connection.query(
      'INSERT INTO cccat17.position (position_id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5)',
      [position.positionId, position.rideId, position.lat, position.long, position.date],
    );
  }

  async getLastPositionFromRideId(rideId: string): Promise<Position | undefined> {
    const [positionData] = await this.connection.query(
      'SELECT * FROM cccat17.position WHERE ride_id = $1 ORDER BY date DESC LIMIT 1',
      [rideId],
    );

    if (!positionData) return;

    return new Position(
      positionData.position_id,
      positionData.ride_id,
      parseFloat(positionData.lat),
      parseFloat(positionData.long),
      positionData.date,
    );
  }
}
