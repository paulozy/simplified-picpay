export class PayerNotFoundError extends Error {
  constructor(id: string) {
    super(`Payer with id "${id}" not found`);
    this.name = 'PayerNotFoundError';
  }
}