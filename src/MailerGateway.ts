export default class MailerGateway {
  async send(recipient: string, subject: string, message: string): Promise<void> {
    console.log(recipient, subject, message); // TODO: Remove
  }
}
