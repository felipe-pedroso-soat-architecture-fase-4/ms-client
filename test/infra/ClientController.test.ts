import ClientController from '../../src/infra/http/ClientController';
import { ExpressAdapter } from '../../src/infra/http/HttpServer';
import { GetClientByCpf } from '../../src/application/usecase/GetClientByCpf';
import { GetClientById } from '../../src/application/usecase/GetClientById';
import { RegisterClient } from '../../src/application/usecase/RegisterClient';
import express from 'express';
import request from 'supertest';

describe('ClientController', () => {
  let app: express.Application;
  let registerClient: RegisterClient;
  let getClientById: GetClientById;
  let getClientByCpf: GetClientByCpf;

  beforeEach(() => {
    const httpServer = new ExpressAdapter();
    app = httpServer['app'];

    registerClient = {
      execute: jest.fn().mockResolvedValue({ clientId: '1', name: 'John Doe', cpf: '12345678900' })
    } as any;
    getClientById = {
      execute: jest.fn().mockResolvedValue({ clientId: '1', name: 'John Doe', cpf: '12345678900' })
    } as any;
    getClientByCpf = {
      execute: jest.fn().mockResolvedValue({ clientId: '1', name: 'John Doe', cpf: '12345678900' })
    } as any;

    new ClientController(httpServer, registerClient, getClientById, getClientByCpf);
  });

  it('should register a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({ name: 'John Doe', email: 'john.doe@example.com', cpf: '12345678900' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ clientId: '1', name: 'John Doe', cpf: '12345678900' });
    expect(registerClient.execute).toHaveBeenCalledWith({ name: 'John Doe', email: 'john.doe@example.com', cpf: '12345678900' });
  });

  it('should get a client by id', async () => {
    const response = await request(app).get('/clients/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ clientId: '1', name: 'John Doe', cpf: '12345678900' });
    expect(getClientById.execute).toHaveBeenCalledWith('1');
  });

  it('should get a client by cpf', async () => {
    const response = await request(app).get('/clients/cpf/12345678900');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ clientId: '1', name: 'John Doe', cpf: '12345678900' });
    expect(getClientByCpf.execute).toHaveBeenCalledWith('12345678900');
  });
});