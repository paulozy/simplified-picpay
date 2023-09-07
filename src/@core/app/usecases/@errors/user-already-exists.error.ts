export class UserAlreadyExistsError extends Error {
  constructor(email: string, document: string) {
    super(`User with email "${email}" or document "${document}" already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}