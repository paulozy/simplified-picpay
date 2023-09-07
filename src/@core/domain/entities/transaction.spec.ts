import { InvalidPayeeError } from "./@errors/invalid-payee.error"
import { InvalidPayerError } from "./@errors/invalid-payer.error"
import { InvalidValueError } from "./@errors/invalid-value.error"
import { Transaction } from "./transaction"

describe('transaction entity', () => {

  const payload = {
    payer: 'any_payer',
    payee: 'any_payee',
    value: 10,
  }

  it('should create a transaction', () => {
    const transactionOrError = Transaction.create(payload)

    expect(transactionOrError.isRight()).toBeTruthy()

    const transaction = transactionOrError.value as Transaction

    expect(transaction.id).toBeDefined()
    expect(transaction.payer).toEqual(payload.payer)
    expect(transaction.payee).toEqual(payload.payee)
    expect(transaction.value).toEqual(payload.value)
    expect(transaction.created_at).toBeDefined()
  })

  it('should not create a transaction with invalid value', () => {
    const test_cases = [
      0,
      -1,
      -10,
      NaN,
      Infinity,
      -Infinity,
    ]

    test_cases.forEach(test_case => {
      const transactionOrError = Transaction.create({
        ...payload,
        value: test_case
      })
      
      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toBeInstanceOf(InvalidValueError)
    })
  })

  it('should not create a transaction with invalid payer', () => {
    const test_cases = [
      '',
      ' ',
      '   ',
      null,
      undefined,
    ]

    test_cases.forEach(test_case => {
      const transactionOrError = Transaction.create({
        ...payload,
        payer: test_case
      })
      
      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toBeInstanceOf(InvalidPayerError)
    })
  })

  it('should not create a transaction with invalid payee', () => {
    const test_cases = [
      '',
      ' ',
      '   ',
      null,
      undefined,
    ]

    test_cases.forEach(test_case => {
      const transactionOrError = Transaction.create({
        ...payload,
        payee: test_case
      })
      
      expect(transactionOrError.isLeft()).toBeTruthy()
      expect(transactionOrError.value).toBeInstanceOf(InvalidPayeeError)
    })
  })
})
