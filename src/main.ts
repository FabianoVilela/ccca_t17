import GetAccount from './application/usecases/account/GetAccount';
import Signup from './application/usecases/account/Signup';
import AccountController from './infra/controllers/AccountController';
import { PgPromiseAdapter } from './infra/databases/DatabaseConnection';
import { ExpressAdapter } from './infra/http/HttpServer';
import { AccountRepositoryDatabase } from './infra/repositories/AccountRepository';

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);

new AccountController(httpServer, signup, getAccount);

httpServer.listen(3000);
