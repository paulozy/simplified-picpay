import { Transaction } from "@core/domain/entities/transaction";
import { ListTransactionsInput, TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { Injectable } from "@nestjs/common";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<void> {
    const rawData = TransactionMapper.toPersistance(transaction);

    await this.prisma.transaction.create({
      data: rawData
    })
  }
  
  async findById(id: string): Promise<Transaction> {
    const rawData = await this.prisma.transaction.findUnique({
      where: {
        id
      }
    })

    const transaction = TransactionMapper.toDomain(rawData);

    return transaction;
  }
  
  async list({payer, payee, value}: ListTransactionsInput): Promise<Transaction[]> {
    const rawData = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { payer },
          { payee },
          { value }
        ]
      }
    })

    const transactions = rawData.map(rawTransaction => TransactionMapper.toDomain(rawTransaction));

    return transactions;
  }
}