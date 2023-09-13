import { Transaction } from "@core/domain/entities/transaction";
import { Transaction as RawTransaction } from "@prisma/client";
import { MapperTransactionError } from "src/infra/@shared/errors/mapper-transaction.error";

export class TransactionMapper {
  static toPersistance(transaction: Transaction): RawTransaction {
    return {
      id: transaction.id,
      payer: transaction.payer,
      payee: transaction.payee,
      value: transaction.value,
      created_at: transaction.created_at
    }
  }

  static toDomain(rawTransaction: RawTransaction): Transaction {
    const transactionOrError = Transaction.create({
      id: rawTransaction.id,
      payer: rawTransaction.payer,
      payee: rawTransaction.payee,
      value: rawTransaction.value,
      created_at: rawTransaction.created_at
    })

    if(transactionOrError.isLeft()) {
      throw new MapperTransactionError(transactionOrError.value.name)
    }

    const transaction = transactionOrError.value

    return transaction
  }
}