import crypto from 'crypto';
import Coord from '../vos/Coord';

export default class SuperRide {
  private from: Coord;
  private to: Coord;

  constructor(
    readonly rideId: string,
    readonly passenger: any,
    readonly driver: any | null,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly status: string,
    readonly date: Date,
  ) {
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  static create(
    passenger: any,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = crypto.randomUUID();
    const status = 'requested';
    const date = new Date();
    return new SuperRide(
      rideId,
      passenger,
      null,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
    );
  }

  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }

  getPassengerName() {
    return this.passenger.getName();
  }
}
