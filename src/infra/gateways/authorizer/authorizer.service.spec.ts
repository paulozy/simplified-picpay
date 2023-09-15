import { AuthorizerGateway } from "@core/domain/gateways/authorizer.interface";
import { AuthorizerService } from "./authorizer.service";

describe('Authorizer Service Gateway', () => {
  let authorizerGateway: AuthorizerGateway;

  beforeEach(() => {
    authorizerGateway = new AuthorizerService();
  })

  it('should return a valid response', async () => {
    const response = await authorizerGateway.authorize();
    expect(response).toHaveProperty('message');
  })
})
