export class TransactionNotFoundError extends Error {
  constructor(id: string) {
    super(`Transaction with id "${id}" not found`);
    this.name = 'TransactionNotFoundError';
  }
}