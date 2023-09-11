const messages = {
  'shopkeeper': 'Shopkeeper cannot make transactions',
  'default': 'Transaction not authorized',
}

export class TransactionNotAuthorizedError extends Error {
  constructor(message?: string) {
    super(message ? messages[message] : messages['default']);
    this.name = 'TransactionNotAuthorizedError';
  }
}