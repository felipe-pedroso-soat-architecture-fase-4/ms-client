export default class Cpf {
    private FACTOR_FIRST_DIGIT = 10;
    private FACTOR_SECOND_DIGIT = 11;

    private value: string
    constructor(cpf: string) {
        const isValidCpf = this.validateCpf(cpf);
          if (!isValidCpf) {
            throw new Error("Invalid CPF");
          }
        this.value = cpf
    }
    getValue() {
        return this.value
    }

    private validateCpf(rawCpf: string) {
        if (!rawCpf) return false;
        const cpf = this.removeNonDigits(rawCpf);
        if (this.isInvalidLength(cpf)) return false;
        if (this.hasAllDigitsEqual(cpf)) return false;
        const digit1 = this.calculateDigit(cpf, this.FACTOR_FIRST_DIGIT);
        const digit2 = this.calculateDigit(cpf, this.FACTOR_SECOND_DIGIT);
        return this.extractDigit(cpf) === `${digit1}${digit2}`;
      }

    private removeNonDigits(cpf: string) {
        return cpf.replace(/\D/g, "");
    }
      
    private isInvalidLength(cpf: string) {
    const CPF_LENGTH = 11;
    return cpf.length !== CPF_LENGTH;
    }
      
    private hasAllDigitsEqual(cpf: string) {
    const [firstCpfDigit] = cpf;
    return [...cpf].every((digit) => digit === firstCpfDigit);
    }
      
    private calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
        if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
    }
      
    private extractDigit(cpf: string) {
    return cpf.slice(9);
    }
}