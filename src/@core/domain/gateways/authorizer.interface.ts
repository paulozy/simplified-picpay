export abstract class Authorizer {
  abstract authorize(): Promise<string>
}