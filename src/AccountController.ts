
import Signup from './Signup';
import GetAccount from './GetAccount';
import HttpServer from './HttpServer';

export default class API{
  constructor(readonly httpServer: HttpServer, readonly signup: Signup, readonly getAccount: GetAccount) {
    this.httpServer.regitster('post', '/signup', async (params: any, body: any) => {
      const input = body;
      const output = await this.signup.execute(input);

      return output;
    });

    this.httpServer.regitster("get", "/accounts/:{accountId}", async (params: any, body: any) => {
      const accountId = params.accountId;
      const output = await this.getAccount.execute(accountId);

      return output;
    });
  }
}
