import Cpf from "../src/domain/vo/Cpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "should test whether the CPF is valid: %s",
  function (cpf: string) {
    expect(new Cpf(cpf)).toBeDefined();
  },
);

test.each(["8774824990", null, undefined, "44444444444"])(
  "should test whether the CPF is invalid: %s",
  function (cpf: any) {
    expect(() => new Cpf(cpf)).toThrow("Invalid CPF");
  },
);
