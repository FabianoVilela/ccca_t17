import RideRepository from '../../application/repositories/RideRepository';
import Ride from '../../domain/entities/Ride';
import DatabaseConnection from '../databases/DatabaseConnection';

export default class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(ride: Ride): Promise<void> {
    await this.connection.query(
      'INSERT INTO cccat17.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, status, date, distance, fare) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        ride.rideId,
        ride.passengerId,
        ride.driverId || null,
        ride.getFrom().getLat(),
        ride.getFrom().getLong(),
        ride.getTo().getLat(),
        ride.getTo().getLong(),
        ride.status,
        ride.date,
        ride.distance,
        ride.fare,
      ],
    );
  }

  async getById(rideId: string): Promise<Ride> {
    const [rideData] = await this.connection.query(
      'SELECT * FROM cccat17.ride WHERE ride_id = $1',
      [rideId],
    );

    if (!rideData) throw new Error();

    return new Ride(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.status,
      rideData.date,
      parseFloat(rideData.distance),
      parseFloat(rideData.fare),
    );
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const [rideData] = await this.connection.query(
      "SELECT COUNT(*)::int AS COUNT FROM cccat17.ride WHERE passenger_id = $1 AND status IN ('requested', 'accepted', 'in_progress')",
      [passengerId],
    );

    return rideData.count > 0;
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const [rideData] = await this.connection.query(
      "SELECT COUNT(*)::int AS COUNT FROM cccat17.ride WHERE driver_id = $1 AND status IN ('accepted',  'in_progress')",
      [driverId],
    );
    return rideData.count > 0;
  }

  async updateRide(ride: Ride): Promise<void> {
    await this.connection.query(
      'UPDATE cccat17.ride SET driver_id = $1, status = $2, distance = $3, fare = $4 WHERE ride_id = $5',
      [ride.driverId, ride.status, ride.distance, ride.fare, ride.rideId],
    );
  }
}
