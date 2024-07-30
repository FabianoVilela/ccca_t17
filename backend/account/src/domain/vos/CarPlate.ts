import { validateCarPlate } from '../../utils';

export default class CarPlate {
  private value?: string;

  constructor(carPlate?: string) {
    const isValidCarPlate = validateCarPlate(carPlate);

    if (carPlate && !isValidCarPlate) throw new Error('Invalid car plate!');

    this.value = carPlate;
  }

  getValue() {
    return this.value;
  }
}
