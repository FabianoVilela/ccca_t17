export default interface MailerGateway {
  send(email: string, subject: string, message: string): Promise<void>;
}
