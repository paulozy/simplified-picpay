export class InvalidPayeeError extends Error {
  constructor(value: string) {
    super(`The value "${value}" is invalid for payee`)
    this.name = 'InvalidPayeeError'
  }
}