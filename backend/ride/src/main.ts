import Registry from './infra/di/Registry';
import { ExpressAdapter } from './infra/http/HttpServer';

const httpServer = new ExpressAdapter();

Registry.getInstance().provide('httpServer', httpServer);

httpServer.listen(3001);
