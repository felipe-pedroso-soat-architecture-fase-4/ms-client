import { ClientRepository } from "../../infra/repository/ClientRepository";

export class GetClientByCpf {
  constructor(readonly clientRepository: ClientRepository) {}

  async execute(cpf: string): Promise<Output | undefined> {
    const client = await this.clientRepository.getClientByCPF(cpf);
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
