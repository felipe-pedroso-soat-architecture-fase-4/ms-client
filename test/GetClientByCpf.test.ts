import { ClientRepositoryMemory } from "../src/infra/repository/ClientRepository";
import { GetClientByCpf } from "../src/application/usecase/GetClientByCpf";
import { RegisterClient } from "../src/application/usecase/RegisterClient";

let registerClient: RegisterClient;
let getClientByCpf: GetClientByCpf;

beforeEach(async () => {
  const clientRepository = new ClientRepositoryMemory();
  registerClient = new RegisterClient(clientRepository);
  getClientByCpf = new GetClientByCpf(clientRepository);
});

it("should return client by cpf correctly", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await registerClient.execute(input);
  const outputGetClient = await getClientByCpf.execute(input.cpf);

  expect(outputGetClient?.name).toBe(input.name);
  expect(outputGetClient?.email).toBe(input.email);
  expect(outputGetClient?.cpf).toBe(input.cpf);
});

it("should throw an error if client is not found", async () => {
  const cpf = "12345678900";
  await expect(() => getClientByCpf.execute(cpf)).rejects.toThrow("Client not found");
});