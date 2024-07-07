import pgp from 'pg-promise';

const CONNECTION_STRING = 'postgre://postgres:docker@localhost:5433/app'

export default interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export default class PgPromisseAdapter implements DatabaseConnection{
  connection: any;

  constructor() {
    this.connection = pgp()(CONNECTION_STRING);
  }

  async query(statement: string, params: any) {
    return await this.connection.query(statement, params);
  }

  async close() {
    return await this.connection.$pool.end();
  }
}