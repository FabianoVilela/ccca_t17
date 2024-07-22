import DistanceCalculator from '../services/DistanceCalculator';
import Coord from './Coord';

export default class Segment {
  from: Coord;
  to: Coord;

  constructor(from: Coord, to: Coord) {
    if (!from || !to) throw new Error('Invalid segment');

    this.from = from;
    this.to = to;
  }

  getDistance() {
    return DistanceCalculator.calculate(this.from, this.to);
  }
}
