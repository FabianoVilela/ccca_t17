import { validateName } from '../../utils';

export default class Name {
  private value: string;

  constructor(name: string) {
    const isValidName = validateName(name);

    if (!isValidName) throw new Error('Invalid name!');

    this.value = name;
  }

  getValue() {
    return this.value;
  }
}
