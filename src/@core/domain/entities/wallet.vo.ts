
export type WalletProps = {
  balance: number
  updated_at?: number
}

export class Wallet {
  private _balance: number
  private _updated_at: number

  private constructor(props: WalletProps) {
    this._balance = props.balance
    this._updated_at = props.updated_at ?? Date.now()
  }

  static create(props: WalletProps): Wallet {
    const wallet = new Wallet(props)

    return wallet
  }

  public addBalance(value: number) {
    this._balance += value
    this._updated_at = Date.now()
  }

  public subtractBalance(value: number) {
    this._balance -= value
    this._updated_at = Date.now()
  }

  get balance(): number {
    return this._balance
  }

  get updated_at(): number {
    return this._updated_at
  }
}