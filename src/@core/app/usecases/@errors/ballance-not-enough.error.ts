export class BallanceNotEnoughError extends Error {
  constructor(balance: number, value: number) {
    super(`Ballance not enough. Balance: ${balance}, Value: ${value}`);
    this.name = 'BallanceNotEnoughError';
  }
}