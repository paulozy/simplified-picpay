import { TransactionUseCases } from "@core/app/factories/transaction-usecases.factory";
import { UserUseCases } from "@core/app/factories/user-usecases.factory";
import { Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { TransactionService } from "./services/transaction.service";
import { UserService } from "./services/user.service";

@Module({
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    UserUseCases,
    TransactionService,
    TransactionUseCases
  ],
})
export class HttpModule {}