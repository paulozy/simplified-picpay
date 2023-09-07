import { Either, left, right } from "@core/logic/either";
import { randomUUID as uuid } from "crypto";
import { InvalidPayeeError } from "./@errors/invalid-payee.error";
import { InvalidPayerError } from "./@errors/invalid-payer.error";
import { InvalidValueError } from "./@errors/invalid-value.error";

enum TransactionType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

type TransactionProps = {
  id?: string;
  payer: string;
  payee: string;
  value: number;
  created_at?: number;
}

export type CreateTransactionResponse = Either<InvalidValueError, Transaction>

export class Transaction {
  private _id: string;
  private _payer: string;
  private _payee: string;
  private _value: number;
  private _created_at: number;
  
  private constructor(props: TransactionProps) {
    this._id = props.id ?? uuid();
    this._payer = props.payer;
    this._payee = props.payee;
    this._value = props.value;
    this._created_at = props.created_at ?? Date.now()
  }

  static create(props: TransactionProps): CreateTransactionResponse {
    if(!this.validateValue(props.value)) return left(new InvalidValueError(props.value))
    if(!this.validatePayer(props.payer)) return left(new InvalidPayerError(props.payer))
    if(!this.validatePayee(props.payee)) return left(new InvalidPayeeError(props.payee))

    const transaction = new Transaction(props);
    return right(transaction);
  }

  private static validateValue(value: number): boolean {
    if(value <= 0 || isNaN(value) || !isFinite(value)) return false;
    return true;
  }

  private static validatePayer(payer: string): boolean {
    if(!payer || payer.trim() === '') return false;
    return true;
  }

  private static validatePayee(payee: string): boolean {
    if(!payee || payee.trim() === '') return false;
    return true;
  }

  get id(): string {
    return this._id;
  }

  get payer(): string {
    return this._payer;
  }

  get payee(): string {
    return this._payee;
  }

  get value(): number {
    return this._value;
  }

  get created_at(): number {
    return this._created_at;
  }
}