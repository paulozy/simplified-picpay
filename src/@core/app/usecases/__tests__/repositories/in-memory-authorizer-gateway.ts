import { AuthorizeResponse, AuthorizerGateway, AuthorizerStatus } from "@core/domain/gateways/authorizer.interface";

export class InMemoryAuthorizerGateway implements AuthorizerGateway {
  async authorize(): Promise<AuthorizeResponse> {
    const response = await fetch('https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6')
    const data = await response.json();

    if(data.message === 'Não autorizado') return { message: AuthorizerStatus.UNAUTHORIZED }
    
    return { message: AuthorizerStatus.AUTHORIZED }
  }
}