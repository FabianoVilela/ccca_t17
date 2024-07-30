import Ride from '../../domain/entities/Ride';
import SuperRide from '../../domain/entities/SuperRide';

export default interface SuperRideRepository {
  save(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<SuperRide>;
}
