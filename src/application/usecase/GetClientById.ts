import { ClientRepository } from "../../infra/repository/ClientRepository";

export type ErrorOutput = { error: string; code: number };

export class GetClientById {
  constructor(readonly clientRepository: ClientRepository) {}

  async execute(client_id: string): Promise<Output | undefined> {
    const client = await this.clientRepository.getClientById(client_id);
    if (client) {
      return {
        account_id: client.account_id,
        name: client.getName(),
        email: client.getEmail(),
        cpf: client.getCpf(),
      };
    } else {
      throw new Error("Client not found");
    }
  }
}

//DTO
type Output = {
  account_id: string;
  name: string;
  email: string;
  cpf: string;
}
