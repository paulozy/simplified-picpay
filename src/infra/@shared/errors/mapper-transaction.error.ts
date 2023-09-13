export class MapperTransactionError extends Error {
  constructor(message: string) {
    super(`Error mapping transaction: ${message}`);
    this.name = 'MapperTransactionError';
  }
}