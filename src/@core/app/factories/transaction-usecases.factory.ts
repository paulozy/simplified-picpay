import { AuthorizerGateway } from "@core/domain/gateways/authorizer.interface";
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { ListTransactionsUseCase } from "../usecases/transactions/list-transactions.usecase";
import { NewTransactionUseCase } from "../usecases/transactions/new-transaction.usecase";
import { ShowTransactionUseCase } from "../usecases/transactions/show-transaction.usecase";

export interface TransactionUseCases {
  new: NewTransactionUseCase
  show: ShowTransactionUseCase
  list: ListTransactionsUseCase
}

export const TransactionUseCases = {
  provide: 'TransactionUseCases',
  useFactory: (
    transactionRepository: TransactionRepository,
    userRepository: UserRepository,
    authorizerGateway: AuthorizerGateway
  ) => ({
    new: new NewTransactionUseCase(userRepository, transactionRepository, authorizerGateway),
    show: new ShowTransactionUseCase(transactionRepository),
    list: new ListTransactionsUseCase(transactionRepository),
  }),
  inject: [TransactionRepository, UserRepository, AuthorizerGateway],
}