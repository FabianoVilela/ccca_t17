import GetAccount from '../../application/usecases/account/GetAccount';
import Signup from '../../application/usecases/account/Signup';
import HttpServer from '../http/HttpServer';

export default class API {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount,
  ) {
    this.httpServer.regitster('post', '/signup', async (params: any, body: any) => {
      const input = body;
      const output = await this.signup.execute(input);

      return output;
    });

    this.httpServer.regitster(
      'get',
      '/accounts/:{accountId}',
      async (params: any, body: any) => {
        const accountId = params.accountId;
        const output = await this.getAccount.execute(accountId);

        return output;
      },
    );
  }
}
