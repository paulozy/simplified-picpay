import { Transaction } from "@core/domain/entities/transaction"
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface"
import { Either, right } from "@core/logic/either"

export type ListTransactionsUseCaseInput = {
  payer: string
  payee?: string
  value?: number
  date?: Date
}

export type ListTransactionsUseCaseResponse = Either<void, Transaction[]>

export class ListTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: ListTransactionsUseCaseInput) {
    const transactions = await this.transactionRepository.list(input)

    return right(transactions)
  }
}