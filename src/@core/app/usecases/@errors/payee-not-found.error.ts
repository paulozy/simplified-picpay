export class PayeeNotFoundError extends Error {
  constructor(id: string) {
    super(`Payee with id "${id}" not found`);
    this.name = 'PayeeNotFoundError';
  }
}