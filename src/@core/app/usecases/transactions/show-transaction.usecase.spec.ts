import { Transaction } from "@core/domain/entities/transaction"
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface"
import { TransactionNotFoundError } from "../@errors/transaction-not-found.error"
import { InMemoryTransactionRepository } from "../__tests__/repositories/in-memory-transaction-repository"
import { ShowTransactionUseCase } from "./show-transaction.usecase"

describe('', () => {
  let transactionRepository: TransactionRepository
  let usecase: ShowTransactionUseCase

  let transaction: Transaction

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()

    transaction = Transaction.create({
      payer: 'any_payer',
      payee: 'any_payee',
      value: 10,
    }).value as Transaction

    await transactionRepository.save(transaction)

    usecase = new ShowTransactionUseCase(transactionRepository)
  })

  it('should return a transaction', async () => {
    const response = await usecase.execute(transaction.id)

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(transaction)
  })

  it('should return a transaction not found error', async () => {
    const response = await usecase.execute('any_id')

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(TransactionNotFoundError)
  })
})
