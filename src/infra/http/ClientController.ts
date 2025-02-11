import { GetClientByCpf } from "../../application/usecase/GetClientByCpf";
import { GetClientById } from "../../application/usecase/GetClientById";
import HttpServer from "./HttpServer";
import { RegisterClient } from "../../application/usecase/RegisterClient";

export default class ClientController {
    constructor(readonly httpServer: HttpServer, readonly registerClient: RegisterClient, readonly getClientById: GetClientById, readonly getClientByCpf: GetClientByCpf) { 
        httpServer.register("post", "/clients", async (req: any) => {
            const output = await registerClient.execute(req.body);
            return output;
        });
        httpServer.register("get", "/clients/:client_id", async (req: any) => {
            const output = await getClientById.execute(req.params.client_id);
            return output;
        });
        httpServer.register("get", "/clients/cpf/:cpf", async (req: any) => {
            const output = await getClientByCpf.execute(req.params.cpf);
            return output;
        });
    }
}