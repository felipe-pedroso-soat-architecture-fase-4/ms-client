import Client from "../../domain/entity/Client";
import { ClientRepository } from "../../infra/repository/ClientRepository";

export class RegisterClient {
  constructor(readonly clientRepository: ClientRepository) {}

  async execute({ cpf, name, email }: any): Promise<Output | undefined> {
    const isEmailAlreadyRegistered =
      await this.clientRepository.getClientByEmail(email);
    if (isEmailAlreadyRegistered) {
      throw new Error("Email already registered");
    }
    const client = Client.create(name, email, cpf);
    const insertedClient = await this.clientRepository.createClient(client);  
    return {
      account_id: insertedClient.account_id,
      name: insertedClient.getName(),
      email: insertedClient.getEmail(),
      cpf: insertedClient.getCpf(),
    };
  } 
}

//DTO
type Output = {
  account_id: string;
  name: string;
  email: string;
  cpf: string;
}

