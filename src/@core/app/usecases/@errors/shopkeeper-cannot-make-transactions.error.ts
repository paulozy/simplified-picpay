export class ShopkeeperCannotMakeTransactionsError extends Error {
  constructor() {
    super(`Shopkeeper cannot make transactions`);
    this.name = 'ShopkeeperCannotMakeTransactionsError';
  }
}