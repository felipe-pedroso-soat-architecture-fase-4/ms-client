import { ClientRepositoryMemory } from "../src/infra/repository/ClientRepository";
import { GetClientByCpf } from "../src/application/usecase/GetClientByCpf";
import { GetClientById } from "../src/application/usecase/GetClientById";
import { RegisterClient } from "../src/application/usecase/RegisterClient";

let registerClient: RegisterClient;
let getClientById: GetClientById;
let getClientByCpf: GetClientByCpf;

beforeEach(async () => {
  const clientRepository = new ClientRepositoryMemory();  
  registerClient = new RegisterClient(clientRepository);
  getClientById = new GetClientById(clientRepository);
  getClientByCpf = new GetClientByCpf(clientRepository);
});

it("should create a client correctly", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  const outputClient = await registerClient.execute(input);
  expect(outputClient?.account_id).toBeDefined();

  const outputGetClient = await getClientById.execute(outputClient!.account_id);

  expect(outputGetClient?.name).toBe(input.name);
  expect(outputGetClient?.email).toBe(input.email);
  expect(outputGetClient?.cpf).toBe(input.cpf);
});

it("should return an error if the cpf is not valid", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "6666",
  };
  await expect(() => registerClient.execute(input)).rejects.toThrow("Invalid CPF");
});

it("should return an error if the name is not valid", async () => {
  const input = {
    name: "",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await expect(() => registerClient.execute(input)).rejects.toThrow("Invalid Name");
});

it("should return an error if the email is not valid", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}gmail.com`,
    cpf: "87748248800",
  };
  await expect(() => registerClient.execute(input)).rejects.toThrow("Invalid Email");
});

it("should return an error if the email is already registered", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await registerClient.execute(input)
  await expect(() => registerClient.execute(input)).rejects.toThrow("Email already registered");
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
})
