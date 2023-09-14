import { Transaction } from "@core/domain/entities/transaction";

export class TransactionViewModel {
  static toHttp(transaction: Transaction) {
    return {
      id: transaction.id,
      payer: transaction.payer,
      payee: transaction.payee,
      value: transaction.value,
      createdAt: transaction.created_at
    };
  }
}