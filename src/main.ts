import GetAccount from './GetAccount';
import Signup from './Signup';
import AccountController from './AccountController';
import { AccountRepositoryDatabase } from './AccountRepository';
import PgPromisseAdapter from './DatabaseConnection';
import { ExpressAdapter } from './HttpServer';

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromisseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);

new AccountController(httpServer, signup, getAccount);

httpServer.listen(3000);
