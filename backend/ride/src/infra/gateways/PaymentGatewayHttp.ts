import PaymentGateway from '../../application/gateways/PaymentGateway';
import HttpClient from '../http/HttpClient';

const BASE_URL = 'http://localhost:3002';

export default class PaymentGatewayHttp implements PaymentGateway {
  constructor(readonly httpClient: HttpClient) {}

  async processPayment(input: any): Promise<any> {
    const response = await this.httpClient.post(`${BASE_URL}/process_payment`, input);

    return response;
  }
}
