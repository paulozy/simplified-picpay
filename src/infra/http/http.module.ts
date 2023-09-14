import { TransactionUseCases } from "@core/app/factories/transaction-usecases.factory";
import { UserUseCases } from "@core/app/factories/user-usecases.factory";
import { Module } from "@nestjs/common";
import { TransactionService } from "./services/transaction.service";
import { UserService } from "./services/user.service";

@Module({
  providers: [
    UserService,
    UserUseCases,
    TransactionService,
    TransactionUseCases
  ],
})
export class HttpModule {}