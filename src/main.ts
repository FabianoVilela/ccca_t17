import GetAccount from './application/usecases/account/GetAccount';
import Signup from './application/usecases/account/Signup';
import Registry from './infra/Registry';
import AccountController from './infra/controllers/AccountController';
import { PgPromiseAdapter } from './infra/databases/DatabaseConnection';
import { ExpressAdapter } from './infra/http/HttpServer';
import { AccountRepositoryDatabase } from './infra/repositories/AccountRepository';

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);

Registry.getInstance().provide('httpServer', httpServer);
Registry.getInstance().provide('signup', signup);
Registry.getInstance().provide('getAccount', getAccount);

new AccountController();

httpServer.listen(3000);
