import { Transaction } from "@core/domain/entities/transaction";
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { Either, left, right } from "@core/logic/either";
import { TransactionNotFoundError } from "../@errors/transaction-not-found.error";

export type ShowTransactionResponse = Either<TransactionNotFoundError, Transaction>;

export class ShowTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string): Promise<ShowTransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) return left(new TransactionNotFoundError(id));

    return right(transaction);
  }
}