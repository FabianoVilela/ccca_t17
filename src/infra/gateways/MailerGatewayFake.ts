import MailerGateway from '../../application/gateways/MailerGateway';

export default class MailerGatewayFake implements MailerGateway {
  async send(email: string, subject: string, message: string): Promise<void> {
    // biome-ignore lint/suspicious/noConsoleLog: Just a mock
    // console.log(
    //   `Sending email to ${email} with subject ${subject} and message ${message}`,
    // );
  }
}
