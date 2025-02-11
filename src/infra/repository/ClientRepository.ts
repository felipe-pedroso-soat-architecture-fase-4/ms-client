import Client from "../../domain/entity/Client";
import DatabaseConnection from "../database/QueryBuilderDatabaseConnection";
import { Knex } from "knex";

// [Driven/Resource] Port
export interface ClientRepository {
  getClientByEmail(email: string): Promise<Client | undefined>;
  getClientById(account_id: string): Promise<Client | undefined>;
  getClientByCPF: (cpf: string) => Promise<Client | undefined>;
  createClient(client: Client): Promise<Client>;
}

// [Driven/Resource] Adapter
export class ClientRepositoryDatabase implements ClientRepository {
  private db: Knex;
  constructor(readonly databaseConnection: DatabaseConnection<Knex>) {
     this.db = this.databaseConnection.builder();
  }
  
  async getClientByEmail(email: string): Promise<Client | undefined> {
    const client = await this.db<any>("clients").where({ email }).first();
    if (!client) {
      return undefined;
    } 
    return Client.restore(client.account_id, client.name, client.email, client.cpf); 
  }
  async getClientById(account_id: string): Promise<Client | undefined> {
    const client = await this.db<any>("clients").where({ account_id }).first();
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async getClientByCPF(cpf: string): Promise<Client | undefined> {
    const client = await this.db<any>("clients").where({ cpf }).first();

    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async createClient(client: Client): Promise<Client> {
    const [insertedClient] = await this.db<any>("clients")
      .insert({
        account_id: client.account_id,
        name: client.getName(),
        email: client.getEmail(),
        cpf: client.getCpf(),
      })
      .returning("*");
    return Client.restore(insertedClient.account_id, insertedClient.name, insertedClient.email, insertedClient.cpf);
  }
}

// [Driven/Resource] Adapter
export class ClientRepositoryMemory implements ClientRepository { 
  private clients: Client[] = [];

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const client = this.clients.find((client) => client.getEmail() === email);
    if (!client) {
      return undefined;
    }
    return client
  }
  async getClientById(account_id: string): Promise<Client | undefined> {
    const client = this.clients.find((client) => client.account_id === account_id); 
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.getName(), client.getEmail(), client.getCpf()); 
  }
  async getClientByCPF(cpf: string): Promise<Client | undefined> {
    const client = this.clients.find((client) => client.getCpf() === cpf);
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.getName(), client.getEmail(), client.getCpf());
  }
  async createClient(client: Client): Promise<Client> {
    this.clients.push(client);
    return Client.restore(client.account_id, client.getName(), client.getEmail(), client.getCpf());
  }
}
