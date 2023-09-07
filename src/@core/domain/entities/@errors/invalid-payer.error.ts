export class InvalidPayerError extends Error {
  constructor(value: string) {
    super(`The value "${value}" is invalid for payer`)
    this.name = 'InvalidPayerError'
  }
}