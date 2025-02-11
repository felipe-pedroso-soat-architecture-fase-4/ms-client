import Client from "../src/domain/entity/Client";
import { ClientRepositoryDatabase } from "../src/infra/repository/ClientRepository";
import { KnexAdapter } from "../src/infra/database/QueryBuilderDatabaseConnection";

it("should create a record in the customer table and query by id", async () => {
  const client = Client.create("John Test", `john.doe${Math.random()}@gmail.com`, "87748248800");
  const connection = new KnexAdapter();
  const clientRepository = new ClientRepositoryDatabase(connection);
  const outputClient = await clientRepository.createClient(client);

  const savedAccountById = await clientRepository.getClientById(
    outputClient?.account_id,
  );

  expect(savedAccountById?.account_id).toBe(client.account_id);
  expect(savedAccountById?.getName()).toBe(client.getName());
  expect(savedAccountById?.getEmail()).toBe(client.getEmail());
  expect(savedAccountById?.getCpf()).toBe(client.getCpf());
  await connection.close();
});

it("should create a record in the customer table and consult by email", async () => {
  const client = Client.create("John Test", `john.doe${Math.random()}@gmail.com`, "87748248800");
  const connection = new KnexAdapter();
  const accountRepository = new ClientRepositoryDatabase(connection);
  const outputClient = await accountRepository.createClient(client);
  const savedAccountByEmail = await accountRepository.getClientByEmail(
    outputClient?.getEmail(),
  );

  expect(savedAccountByEmail?.account_id).toBe(client.account_id);
  expect(savedAccountByEmail?.getName()).toBe(client.getName());
  expect(savedAccountByEmail?.getEmail()).toBe(client.getEmail());
  expect(savedAccountByEmail?.getCpf()).toBe(client.getCpf());
  await connection.close();
});
