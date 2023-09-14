import { ITransactionUseCases } from "@core/app/factories/transaction-usecases.factory";
import { BallanceNotEnoughError } from "@core/app/usecases/@errors/ballance-not-enough.error";
import { PayeeNotFoundError } from "@core/app/usecases/@errors/payee-not-found.error";
import { PayerNotFoundError } from "@core/app/usecases/@errors/payer-not-found.error";
import { TransactionNotAuthorizedError } from "@core/app/usecases/@errors/transaction-not-authorized.error";
import { NewTransactionInput } from "@core/app/usecases/transactions/new-transaction.usecase";
import { InvalidValueError } from "@core/domain/entities/@errors/invalid-value.error";
import { Inject, Injectable } from "@nestjs/common";
import { BadRequest, InternalServerError } from "../http-respondes";
import { TransactionViewModel } from "../view-models/transaction.view-model";

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionUseCases')
    private readonly transactionUseCases: ITransactionUseCases
  ) {}

  async create(data: NewTransactionInput) {
    const { new: newTransaction } = this.transactionUseCases

    const transactionOrError = await newTransaction.execute(data)

    if(transactionOrError.isLeft()) {
      const error = transactionOrError.value

      switch(error.constructor) {
        case InvalidValueError:
          throw new BadRequest(error.message)
        case PayerNotFoundError:
          throw new BadRequest(error.message)
        case PayeeNotFoundError:
          throw new BadRequest(error.message)
        case BallanceNotEnoughError:
          throw new BadRequest(error.message)
        case TransactionNotAuthorizedError:
          throw new BadRequest(error.message)
        default:
          throw new InternalServerError()
      }
    }

    const transaction = transactionOrError.value

    return TransactionViewModel.toHttp(transaction)
  }
}