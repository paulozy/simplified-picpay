import { Transaction } from "../entities/transaction";

export type ListTransactionsInput = {
  payer?: string;
  payee?: string;
  value?: number;
  date?: Date;
}

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): Promise<void>;
  abstract findById(id: string): Promise<Transaction>;
  abstract list(input: ListTransactionsInput): Promise<Transaction[]>;
}