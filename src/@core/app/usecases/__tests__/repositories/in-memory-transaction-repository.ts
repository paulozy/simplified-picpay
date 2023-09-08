import { Transaction } from "@core/domain/entities/transaction";
import { ListTransactionsInput, TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";

export class InMemoryTransactionRepository implements TransactionRepository {
  transactions: Transaction[] = [];

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }
  
  async findById(id: string): Promise<Transaction> {
    const transaction = this.transactions.find(transaction => transaction.id === id);
    return transaction;
  }
  
  async list({date, payee, payer}: ListTransactionsInput): Promise<Transaction[]> {
    const normalizedDate = date ? new Date(date).getTime() : null;

    const transactions = this.transactions.filter(transaction => {
      if(payee && transaction.payee !== payee) return false;
      if(payer && transaction.payer !== payer) return false;
      if(date && transaction.created_at !== normalizedDate) return false;
      return true;
    })

    return transactions;
  }
}