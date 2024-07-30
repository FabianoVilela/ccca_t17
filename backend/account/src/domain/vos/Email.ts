import { validateEmail } from '../../utils';

export default class Email {
  private value: string;

  constructor(email: string) {
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) throw new Error('Invalid e-mail!');

    this.value = email;
  }

  getValue() {
    return this.value;
  }
}
