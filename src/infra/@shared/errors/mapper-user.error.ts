export class MapperUserError extends Error {
  constructor(message: string) {
    super(`Error mapping user: ${message}`);
    this.name = 'MapperUserError';
  }
}