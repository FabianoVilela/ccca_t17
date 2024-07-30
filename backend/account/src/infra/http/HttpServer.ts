import Hapi, { RouteDefMethods } from '@hapi/hapi';
import express from 'express';
import Fastify, { FastifyInstance, HTTPMethods } from 'fastify';

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  server: any;

  constructor() {
    this.server = express();
    this.server.use(express.json());
  }

  register(method: string, url: string, callback: Function) {
    this.server[method](url.replace(/\{|\}/g, ''), async (req: any, res: any) => {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (e: any) {
        res.status(422).json({
          message: e.message,
        });
      }
    });
  }

  listen(port: number) {
    this.server.listen(port);
  }
}

export class HapiAdapter implements HttpServer {
  server: Hapi.Server;

  constructor() {
    this.server = Hapi.server({});
  }

  register(method: RouteDefMethods, url: string, callback: Function): void {
    this.server.route({
      method,
      path: url.replace(/\:/g, ''),
      handler: async (request: any, res: any) => {
        try {
          const output = await callback(request.params, request.payload);

          return output;
        } catch (e: any) {
          return res.response({ message: e.message }).code(422);
        }
      },
    });
  }
  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }
}

export class FastifyAdapter implements HttpServer {
  server: FastifyInstance;

  constructor() {
    this.server = Fastify({});
  }

  register(method: HTTPMethods, url: string, callback: Function): void {
    this.server.route({
      method: method,
      url: url.replace(/\{|\}/g, ''),
      handler: async (req: any, res: any) => {
        try {
          const output = await callback(req.params, req.body);

          return output;
        } catch (e: any) {
          const error = res.code(422).send({ message: e.message });
          this.server.log.error(error);

          return error;
        }
      },
    });
  }

  listen(port: number): void {
    this.server.listen({ port: port });
  }
}
