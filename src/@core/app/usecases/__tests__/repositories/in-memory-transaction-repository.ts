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
  
  async list({date, payee, payer, value}: ListTransactionsInput): Promise<Transaction[]> {
    let transactions = this.transactions.filter(transaction => transaction.payer === payer);

    if(payee) {
      transactions = transactions.filter(transaction => transaction.payee === payee);
    }

    if(value) {
      transactions = transactions.filter(transaction => transaction.value === value);
    }

    if(date) {
      const normalizedDate = new Date(date).getTime()
      transactions = transactions.filter(transaction => transaction.created_at === normalizedDate);
    }

    return transactions;
  }
}