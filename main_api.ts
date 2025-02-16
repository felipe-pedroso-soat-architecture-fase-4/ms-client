import ClientController from "./src/infra/http/ClientController";
import { ClientRepositoryDatabase } from "./src/infra/repository/ClientRepository";
import { ExpressAdapter } from "./src/infra/http/HttpServer";
import { GetClientByCpf } from "./src/application/usecase/GetClientByCpf";
import { GetClientById } from "./src/application/usecase/GetClientById";
import { KnexAdapter } from "./src/infra/database/QueryBuilderDatabaseConnection";
import { RegisterClient } from "./src/application/usecase/RegisterClient";
import { config } from "./src/infra/database/config";
import dotenv from 'dotenv';
import knex from "knex";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const port = Number(process.env.API_PORT || 3001);


const defaultConfig = config[environment]
const defaultConfigPostgres = {
  ...defaultConfig,
  connection: typeof defaultConfig.connection === 'object' ? { ...defaultConfig.connection, database: 'postgres' } : defaultConfig.connection
};

const dbPostgres = knex(defaultConfigPostgres);
async function createDatabase() {
  console.log("test")
  const databases = await dbPostgres.raw("SELECT datname FROM pg_database WHERE datname = 'ms_client_db';");
  if (databases.rows.length === 0) {
      await dbPostgres.raw('CREATE DATABASE "ms_client_db";');
      console.log("Banco de dados 'ms_client_db' criado.");
  } else {
      console.log("Banco de dados 'ms_client_db' já existe.");
  }
}

async function createTables() {
  const db = knex(defaultConfig);
    const clientsExists = await db.schema.hasTable('clients');
    if (!clientsExists) {
      await db.schema.createTable('clients', (table) => {
        table.uuid('account_id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('cpf').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'clients' criada");
    }
}

createDatabase().then(() => createTables()).catch((err) => {
    console.error('Erro ao criar banco de dados ou tabelas:', err);
  }).finally(() => {
    dbPostgres.destroy();
  });

const httpServer = new ExpressAdapter();
const connection = new KnexAdapter();

const clientRepository = new ClientRepositoryDatabase(connection);
const registerClient = new RegisterClient(clientRepository);
const getClientById = new GetClientById(clientRepository);
const getClientByCpf = new GetClientByCpf(clientRepository);
new ClientController(httpServer, registerClient, getClientById, getClientByCpf);

httpServer.listen(port);