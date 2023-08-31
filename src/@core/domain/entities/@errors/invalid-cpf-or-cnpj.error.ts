export class InvalidCPFOrCNPJError extends Error {
  constructor(value: string) {
    super(`The CPF or CNPJ "${value}" is invalid.`)
    this.name = 'InvalidCPFOrCNPJError'
  }
}