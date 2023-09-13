import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaTransactionRepository } from "./prisma/repositories/prisma-transaction.repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user.repository";

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    }
  ],
  exports: [
    PrismaService,
    UserRepository,
    TransactionRepository
  ]
})
export class DatabaseModule {}