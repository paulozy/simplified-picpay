import { InvalidValueError } from "@core/domain/entities/@errors/invalid-value.error";
import { Transaction } from "@core/domain/entities/transaction";
import { User } from "@core/domain/entities/user";
import { TransactionRepository } from "@core/domain/repositories/transaction-repository.interface";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { BallanceNotEnoughError } from "../@errors/ballance-not-enough.error";
import { PayeeNotFoundError } from "../@errors/payee-not-found.error";
import { PayerNotFoundError } from "../@errors/payer-not-found.error";
import { ShopkeeperCannotMakeTransactionsError } from "../@errors/shopkeeper-cannot-make-transactions.error";
import { InMemoryTransactionRepository } from "../__tests__/repositories/in-memory-transaction-repository";
import { InMemoryUserRepository } from "../__tests__/repositories/in-memory-user-repository";
import { NewTransactionUseCase } from "./new-transaction.usecase";

describe('new transaction usecase', () => {
  let userRepository: UserRepository;
  let transactionRepository: TransactionRepository;
  let usecase: NewTransactionUseCase

  let payer: User
  let payee: User

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    transactionRepository = new InMemoryTransactionRepository();

    payer = User.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      document: '123.456.789-00',
      type: 'common',
    }).value as User;

    payee = User.create({
      name: 'Jane Doe',
      email: 'jane_doe@email.com',
      document: '123.456.789-11',
      type: 'common',
    }).value as User;

    payer.wallet.addBalance(100);
  
    await userRepository.save(payer);
    await userRepository.save(payee);

    usecase = new NewTransactionUseCase(userRepository, transactionRepository);
  })

  it('should create a new transaction', async () => {
    const response = await usecase.execute({
      payer: payer.id,
      payee: payee.id,
      value: 50,
    })

    expect(response.isRight()).toBeTruthy();
    
    const transaction = response.value as Transaction
    
    expect(transaction.id).toBeTruthy();
    expect(transaction.payer).toBe(payer.id);
    expect(transaction.payee).toBe(payee.id);
    expect(transaction.value).toBe(50);
    expect(transaction.created_at).toBeDefined();
    
    expect(payer.wallet.balance).toBe(50);
    expect(payee.wallet.balance).toBe(50);
  })

  it('should not create a new transaction if payer does not exist', async () => {
    const response = await usecase.execute({
      payer: 'invalid_payer_id',
      payee: payee.id,
      value: 50,
    })

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(PayerNotFoundError);
  })

  it('should not create a new transaction if payee does not exist', async () => {
    const response = await usecase.execute({
      payer: payer.id,
      payee: 'invalid_payee_id',
      value: 50,
    })

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(PayeeNotFoundError);
  })

  it('should not create a new transaction if payer is an shopkeeper', async () => {
    payer = User.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      document: '123.456.789-00',
      type: 'shopkeeper',
    }).value as User;

    await userRepository.save(payer);

    const response = await usecase.execute({
      payer: payer.id,
      payee: payee.id,
      value: 50,
    })

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(ShopkeeperCannotMakeTransactionsError);
  })

  it('should not create a new transaction if payer does not have enough balance', async () => {
    const response = await usecase.execute({
      payer: payer.id,
      payee: payee.id,
      value: 150,
    })

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(BallanceNotEnoughError);
  })

  it('should not create a new transaction if value is invalid', async () => {
    const tests_cases = [
      0,
      -50,
      NaN,
      -Infinity
    ]

    for (const value of tests_cases) {
      const response = await usecase.execute({
        payer: payer.id,
        payee: payee.id,
        value,
      })
        
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toBeInstanceOf(InvalidValueError);
    }
  })
  
  it('should not create a new transaction if transaction save fails', async () => {
    const saveSpy = jest.spyOn(transactionRepository, 'save').mockImplementationOnce(() => {
      throw new Error('Transaction save failed');
    })

    const response = await usecase.execute({
      payer: payer.id,
      payee: payee.id,
      value: 50,
    })
    
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(Error);
    expect(saveSpy).toHaveBeenCalled();
    expect(transactionRepository['transactions']).toHaveLength(0);

    expect(payer.wallet.balance).toBe(100);
    expect(payee.wallet.balance).toBe(0);
  })
})
