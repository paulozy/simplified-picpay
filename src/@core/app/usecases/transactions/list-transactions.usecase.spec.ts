import { Transaction } from "@core/domain/entities/transaction"
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface"
import { InMemoryTransactionRepository } from "../__tests__/repositories/in-memory-transaction-repository"
import { ListTransactionsUseCase } from "./list-transactions.usecase"

describe('', () => {
  let transactionRepository: TransactionRepository
  let usecase: ListTransactionsUseCase

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()

    for(let i = 0; i < 6; i++) {
      const created_at = i % 2 === 0 ? new Date('2023-08-19').getTime() : null
      const payee = i % 2 === 0 ? 'any_payee' : 'any_payee_2'
      const value = i % 2 === 0 ? 50 : Math.floor(Math.random() * 100)

      const transaction = Transaction.create({
        payer: 'any_payer',
        payee,
        value,
        created_at
      }).value as Transaction
  
      await transactionRepository.save(transaction)
    }

    usecase = new ListTransactionsUseCase(transactionRepository)
  })

  it('should return a list of transactions', async () => {
    const response = await usecase.execute({
      payer: 'any_payer'
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveLength(6)
  })

  it('should return a list of transactions filtered by payee', async () => {
    const response = await usecase.execute({
      payer: 'any_payer',
      payee: 'any_payee'
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveLength(3)
  })

  it('should return a list of transactions filtered by value', async () => {
    const response = await usecase.execute({
      payer: 'any_payer',
      value: 50
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveLength(3)
  })

  it('should return a list of transactions filtered by date', async () => {
    const response = await usecase.execute({
      payer: 'any_payer',
      date: new Date('2023-08-19')
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveLength(3)
  })

  it('should return a list of transactions filtered by all fields', async () => {
    const response = await usecase.execute({
      payer: 'any_payer',
      payee: 'any_payee',
      value: 50,
      date: new Date('2023-08-19')
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveLength(3)
  })

  it('should return an empty list if no transactions were found', async () => {
    const response = await usecase.execute({
      payer: 'non_existent_payer'
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveLength(0)
  })
})
