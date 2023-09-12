import { InvalidValueError } from "@core/domain/entities/@errors/invalid-value.error";
import { Transaction } from "@core/domain/entities/transaction";
import { UserType } from "@core/domain/entities/user";
import { AuthorizerGateway, AuthorizerStatus } from "@core/domain/gateways/authorizer.interface";
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Either, left, right } from "@core/logic/either";
import { BallanceNotEnoughError } from "../@errors/ballance-not-enough.error";
import { PayeeNotFoundError } from "../@errors/payee-not-found.error";
import { PayerNotFoundError } from "../@errors/payer-not-found.error";
import { TransactionNotAuthorizedError } from "../@errors/transaction-not-authorized.error";

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
  | TransactionNotAuthorizedError, 
  Transaction
>

export class NewTransactionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly authorizerGateway: AuthorizerGateway
  ) {}

  async execute(input: NewTransactionUseCaseInput): Promise<NewTransactionUseCaseResponse> {
    const payer = await this.userRepository.findById(input.payer);
    const payee = await this.userRepository.findById(input.payee);

    if(!payer) return left(new PayerNotFoundError(input.payer));
    if(!payee) return left(new PayeeNotFoundError(input.payee));

    if(payer.type === UserType.SHOPKEEPER) return left(new TransactionNotAuthorizedError('shopkeeper'));
    if(payer.wallet.balance < input.value) return left(new BallanceNotEnoughError(payer.wallet.balance, input.value));

    try {
      const authorization = await this.authorizerGateway.authorize();

      if(authorization.message === AuthorizerStatus.UNAUTHORIZED) return left(new TransactionNotAuthorizedError());

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