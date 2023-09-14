import { AuthorizeResponse, AuthorizerGateway, AuthorizerStatus } from '@core/domain/gateways/authorizer.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizerService implements AuthorizerGateway {
  async authorize(): Promise<AuthorizeResponse> {
    const authorizedResponse: AuthorizeResponse = {
      message: AuthorizerStatus.AUTHORIZED,
    }

    const notAuthorizedResponse: AuthorizeResponse = {
      message: AuthorizerStatus.UNAUTHORIZED,
    }

    const threshold = 0.7;
    const randomValue = Math.random();
    return randomValue < threshold ? notAuthorizedResponse : authorizedResponse;
  }
}