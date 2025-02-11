import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";
import { randomUUID } from "crypto";

export default class Client {
   
  private constructor(
    readonly account_id: string,
    private name: Name,
    private email: Email,
    private cpf: Cpf,
  ) {}

    //static factory method
    static create(
         name: string,
         email: string,
         cpf: string) {
        const account_id = randomUUID()
        return new Client(account_id, new Name(name), new Email(email), new Cpf(cpf));
    }

    //static factory method
    static restore(
        account_id: string,
        name: string,
        email: string,
        cpf: string
        ) {
        return new Client(account_id, new Name(name), new Email(email), new Cpf(cpf));
    }
    getName(): string {
        return this.name.getValue();
    }
    getEmail(): string {
        return this.email.getValue();
    }
    getCpf(): string {
        return this.cpf.getValue();
    }
}