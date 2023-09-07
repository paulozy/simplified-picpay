export class InvalidValueError extends Error {
  constructor(value: number) {
    super(`The value ${value} is invalid! Value must be greater than 0.`)
    this.name = 'InvalidValueError'
  }
}