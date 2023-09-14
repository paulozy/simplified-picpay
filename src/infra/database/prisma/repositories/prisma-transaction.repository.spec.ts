import { Transaction } from "@core/domain/entities/transaction"
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface"
import { Transaction as PrismaTransaction } from "@prisma/client"
import { MapperTransactionError } from "src/infra/@shared/errors/mapper-transaction.error"
import { PrismaService } from "../prisma.service"
import { PrismaTransactionRepository } from "./prisma-transaction.repository"

describe('Prisma Transaction Repository', () => {
  let repository: TransactionRepository
  let prisma: PrismaService

  let defaultTransaction: PrismaTransaction

  beforeEach(async () => {
    prisma = new PrismaService()

    defaultTransaction = await prisma.transaction.create({
      data: {
        value: 10,
        payer: 'any_payer',
        payee: 'any_payee',
        created_at: new Date().getTime()
      }
    })

    repository = new PrismaTransactionRepository(prisma)
  })

  afterEach(async () => {
    await prisma.transaction.deleteMany()
    await prisma.$disconnect()
  })

  it('should save a new transaction', async () => {
    const transaction = Transaction.create({
      payer: 'any_payer',
      payee: 'any_payee',
      value: 10,
    }).value as Transaction

    await repository.save(transaction)

    const savedTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id }
    })

    expect(savedTransaction).toBeTruthy()
    expect(savedTransaction?.payer).toBe(transaction.payer)
    expect(savedTransaction?.payee).toBe(transaction.payee)
    expect(savedTransaction?.value).toBe(transaction.value)
  })

  it('should find a transaction by id', async () => {
    const transaction = await repository.findById(defaultTransaction.id)

    expect(transaction).toBeTruthy()
    expect(transaction?.id).toBe(defaultTransaction.id)
    expect(transaction?.payer).toBe(defaultTransaction.payer)
    expect(transaction?.payee).toBe(defaultTransaction.payee)
    expect(transaction?.value).toBe(defaultTransaction.value)
  })

  it('should list transactions by payer', async () => {
    const transactions = await repository.list({
      payer: defaultTransaction.payer,
    })
    
    expect(transactions).toBeTruthy()
    expect(transactions.length).toBe(1)
    expect(transactions[0].payer).toBe(defaultTransaction.payer)
  })

  it('should list transactions by payee', async () => {
    const transactions = await repository.list({
      payee: defaultTransaction.payee,
    })

    expect(transactions).toBeTruthy()
    expect(transactions.length).toBe(1)
    expect(transactions[0].payee).toBe(defaultTransaction.payee)
  })

  it('should list transactions by value', async () => {
    const transactions = await repository.list({
      value: defaultTransaction.value,
    })

    expect(transactions).toBeTruthy()
    expect(transactions.length).toBe(1)
    expect(transactions[0].value).toBe(defaultTransaction.value)
  })

  it('should throw if transaction mapper throws', async () => {
    jest.spyOn(prisma.transaction, 'findUnique').mockImplementationOnce(() => {
      throw new MapperTransactionError('any_error')
    })

    await expect(repository.findById(defaultTransaction.id)).rejects.toThrow()
  })
})
