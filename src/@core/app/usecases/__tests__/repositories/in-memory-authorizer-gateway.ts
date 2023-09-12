import { AuthorizeResponse, AuthorizerGateway, AuthorizerStatus } from "@core/domain/gateways/authorizer.interface";

export class InMemoryAuthorizerGateway implements AuthorizerGateway {
  async authorize(): Promise<AuthorizeResponse> {
    const data = { message: 'Autorizado' }

    if(data.message === 'Não autorizado') return { message: AuthorizerStatus.UNAUTHORIZED }
    
    return { message: AuthorizerStatus.AUTHORIZED }
  }
}