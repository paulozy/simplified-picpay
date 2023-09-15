import { AuthorizerGateway } from "@core/domain/gateways/authorizer.interface";
import { Global, Module } from "@nestjs/common";
import { AuthorizerService } from "./authorizer/authorizer.service";

@Global()
@Module({
  providers: [
    AuthorizerService,
    {
      provide: AuthorizerGateway,
      useClass: AuthorizerService
    }
  ],
  exports: [AuthorizerGateway],
})
export class GatewayModule {}