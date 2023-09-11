export enum AuthorizerStatus {
  AUTHORIZED = 'authorized',
  UNAUTHORIZED = 'unauthorized'
}

export type AuthorizeResponse = {
  message: AuthorizerStatus;
}

export abstract class AuthorizerGateway {
  abstract authorize(): Promise<AuthorizeResponse>
}