import { InvalidValueError } from "@core/domain/entities/@errors/invalid-value.error";
import { Transaction } from "@core/domain/entities/transaction";
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Either, left, right } from "@core/logic/either";
import { BallanceNotEnoughError } from "../@errors/ballance-not-enough.error";
import { PayeeNotFoundError } from "../@errors/payee-not-found.error";
import { PayerNotFoundError } from "../@errors/payer-not-found.error";
import { ShopkeeperCannotMakeTransactionsError } from "../@errors/shopkeeper-cannot-make-transactions.error";

export type NewTransactionUseCaseInput = {
  payer: string;
  payee: string;
  value: number;
}

export type NewTransactionUseCaseResponse = Either<
  InvalidValueError 
  | PayerNotFoundError 
  | PayeeNotFoundError
  | BallanceNotEnoughError
  | ShopkeeperCannotMakeTransactionsError, 
  Transaction
>

export class NewTransactionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(input: NewTransactionUseCaseInput): Promise<NewTransactionUseCaseResponse> {
    const payer = await this.userRepository.findById(input.payer);
    const payee = await this.userRepository.findById(input.payee);

    if(!payer) return left(new PayerNotFoundError(input.payer));
    if(!payee) return left(new PayeeNotFoundError(input.payee));

    if(payer.type === 'shopkeeper') return left(new ShopkeeperCannotMakeTransactionsError());
    if(payer.wallet.balance < input.value) return left(new BallanceNotEnoughError(payer.wallet.balance, input.value));

    try {
      const transactionOrError = Transaction.create({
        payer: input.payer,
        payee: input.payee,
        value: input.value,
      })
  
      if(transactionOrError.isLeft()) return left(transactionOrError.value);
  
      const transaction = transactionOrError.value;
  
      await this.transactionRepository.save(transaction);
  
      payer.wallet.subtractBalance(transaction.value);
      payee.wallet.addBalance(transaction.value);
  
      await this.userRepository.save(payer);
      await this.userRepository.save(payee);

      return right(transaction)
    } catch (error) {
      return left(error);
    }
  }
}