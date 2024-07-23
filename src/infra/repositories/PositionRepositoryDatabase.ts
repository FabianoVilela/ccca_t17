import PositionRepository from '../../application/repositories/PositionRepository';
import Position from '../../domain/entities/Position';
import DatabaseConnection from '../databases/DatabaseConnection';

export default class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async savePosition(position: Position): Promise<void> {
    await this.connection.query(
      'insert into cccat17.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [position.positionId, position.rideId, position.lat, position.long, position.date],
    );
  }

  async getLastPositionFromRideId(rideId: string): Promise<Position | undefined> {
    const [positionData] = await this.connection.query(
      'select * from cccat17.position where ride_id = $1 order by date desc limit 1',
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
