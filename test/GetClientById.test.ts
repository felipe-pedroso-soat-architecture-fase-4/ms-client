import { ClientRepositoryMemory } from "../src/infra/repository/ClientRepository";
import { GetClientById } from "../src/application/usecase/GetClientById";
import { RegisterClient } from "../src/application/usecase/RegisterClient";

let registerClient: RegisterClient;
let getClientById: GetClientById;

beforeEach(async () => {
  const clientRepository = new ClientRepositoryMemory();
  registerClient = new RegisterClient(clientRepository);
  getClientById = new GetClientById(clientRepository);
});

it("should return client by id correctly", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  const outputClient = await registerClient.execute(input);
  const outputGetClient = await getClientById.execute(outputClient!.account_id);

  expect(outputGetClient?.name).toBe(input.name);
  expect(outputGetClient?.email).toBe(input.email);
  expect(outputGetClient?.cpf).toBe(input.cpf);
});

it("should throw an error if client is not found", async () => {
  const clientId = "nonexistent-id";
  await expect(() => getClientById.execute(clientId)).rejects.toThrow("Client not found");
});