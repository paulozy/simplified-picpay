import { Either, left, right } from "@core/logic/either"
import { randomUUID as uuid } from "crypto"
import { InvalidCPFOrCNPJError } from "./@errors/invalid-cpf-or-cnpj.error"
import { InvalidEmailError } from "./@errors/invalid-email.error"
import { InvalidNameError } from "./@errors/invalid-name.error"
import { InvalidTypeError } from "./@errors/invalid-type.error"
import { Wallet } from "./wallet.vo"

export enum UserType {
  COMMON = 'common',
  SHOPKEEPER = 'shopkeeper'
}

export type UserProps = {
  id?: string
  name: string
  email: string
  document: string
  type: string
  wallet?: Wallet
  created_at?: number
  updated_at?: number
}

type CreateUserResponse = Either<InvalidNameError | InvalidEmailError | InvalidCPFOrCNPJError | InvalidTypeError, User>

export class User {
  private _id: string
  private _name: string
  private _email: string
  private _document: string
  private _type: string
  private _wallet: Wallet
  private _created_at: number
  private _updated_at: number

  private constructor(props: UserProps) {
    this._id = props.id ?? uuid()

    this._name = props.name
    this._email = props.email
    this._document = props.document
    this._type = props.type
    this._wallet = props.wallet ?? Wallet.create({ balance: 0 })
    this._created_at = props.created_at ?? Date.now()
    this._updated_at = props.updated_at ?? Date.now()
  }

  static create(props: UserProps): CreateUserResponse {
    if(!this.validateName(props.name)) return left(new InvalidNameError(props.name))
    if(!this.validateEmail(props.email)) return left(new InvalidEmailError(props.email))
    if(!this.validateCPFAndCnpj(props.document)) return left(new InvalidCPFOrCNPJError(props.document))
    if(!this.validateType(props.type)) return left(new InvalidTypeError(props.type))

    const user = new User(props)

    return right(user)
  }

  public update(props: Partial<UserProps>): CreateUserResponse {
    const {name, type} = props

    if(name && !User.validateName(name)) return left(new InvalidNameError(name))
    if(type && !User.validateType(type)) return left(new InvalidTypeError(type))

    this._name = name ?? this._name
    this._type = type ?? this._type
    this._updated_at = Date.now()

    return right(this)
  }

  private static validateName(name: string): boolean {
    if (!name || name.trim().length < 3 || name.trim().length > 255) return false
    return true
  }

  private static validateEmail(email: string): boolean {
    const pattern = /^(?!.*\.\.)(?!.*\.$)(?!.*\.-)(?!.*-_)[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/

    if (!pattern.test(email)) return false

    return true
  }

  private static validateCPFAndCnpj(value: string): boolean {
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
    const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/

    if (!value || !cpfPattern.test(value) && !cnpjPattern.test(value)) return false

    return true
  }

  private static validateType(type: string): boolean {
    if (!Object.values(UserType).includes(type as UserType)) return false
    return true
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get document(): string {
    return this._document
  }

  get type(): string {
    return this._type
  }

  get wallet(): Wallet {
    return this._wallet
  }

  get created_at(): number {
    return this._created_at
  }

  get updated_at(): number {
    return this._updated_at
  }
}