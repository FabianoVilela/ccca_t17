import Ride from '../../domain/entities/Ride';

export default interface RideRepository {
  save(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  hasActiveRideByDriverId(driverId: string): Promise<boolean>;
  updateRide(ride: Ride): Promise<void>;
}
