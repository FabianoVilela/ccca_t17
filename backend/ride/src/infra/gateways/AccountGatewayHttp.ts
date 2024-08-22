import AccountGateway from '../../application/gateways/AccountGateway';
import HttpClient from '../http/HttpClient';

const BASE_URL = 'http://localhost:3000';

export default class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async signup(input: any): Promise<any> {
    const response = await this.httpClient.post(`${BASE_URL}/signup`, input);

    return response;
  }

  async getById(accountId: string): Promise<any> {
    const response = await this.httpClient.get(
      `http://localhost:3000/accounts/${accountId}`,
    );

    return response;
  }
}
