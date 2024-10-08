import crypto from 'crypto';
import Observer from '../../infra/madiators/Observer';
import RideCompletedEvent from '../events/RideCompletedEvent';
import { FareCalculatorFactory } from '../services/FareCalculatorFactory';
import Coord from '../vos/Coord';
import Segment from '../vos/Segment';
import Position from './Position';

// NOTE: Account
type Input = {
  accountId?: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
};

// NOTE: Entity, as Aggregate led by Ride (root) that contains Coord
export default class Ride extends Observer {
  private from: Coord;
  private to: Coord;

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    public driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    public status: string,
    readonly date: Date,
    public distance: number,
    public fare: number,
  ) {
    super();
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = crypto.randomUUID();
    const status = 'requested';
    const date = new Date();
    const distance = 0;
    const fare = 0;

    return new Ride(
      rideId,
      passengerId,
      '',
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      distance,
      fare,
    );
  }

  getFrom() {
    return this.from;
  }

  getTo() {
    return this.to;
  }

  accept(account: Input) {
    if (!account.isDriver) throw new Error('Account is not from a driver');
    if (this.status !== 'requested') throw new Error('Invalid status!');

    this.driverId = account.accountId!;
    this.status = 'accepted';
  }

  start() {
    if (this.status !== 'accepted') throw new Error('Invalid status!');

    this.status = 'in_progress';
  }

  updatePosition(lastPosition: Position, currentPosition: Position) {
    if (this.status !== 'in_progress') throw new Error('Invalid status!');

    const segment = new Segment(lastPosition.coord, currentPosition.coord);
    const distance = segment.getDistance();
    this.distance += distance;

    // NOTE: Single Responsibility Principle + Open/Closed Principle
    this.fare += FareCalculatorFactory.create(currentPosition.date).calculate(distance);
  }

  finish() {
    if (this.status !== 'in_progress') throw new Error('Invalid status');

    this.status = 'completed';

    const event = new RideCompletedEvent(this.rideId, this.fare);

    this.notify('rideCompleted', event);
  }
}
