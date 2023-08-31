export class InvalidTypeError extends Error {
  constructor(type: string) {
    super(`The type "${type}" is invalid. It must be "common" or "shopkeeper".`)
    this.name = 'InvalidTypeError'
  }
}