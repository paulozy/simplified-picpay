import { Wallet } from "./wallet.vo"

describe('Wallet Value Object', () => {
  let payload

  beforeEach(() => {
    payload = {
      balance: 0
    }
  })

  it('should be possible to create a wallet', () => {
    const wallet = Wallet.create(payload)

    expect(wallet.balance).toBe(payload.balance)
    expect(wallet.updated_at).toBeDefined()
  })

  it('should be possible to add balance', () => {
    const wallet = Wallet.create(payload)

    wallet.addBalance(10)

    expect(wallet.balance).toBe(10)
  })

  it('should be possible to subtract balance', () => {
    const wallet = Wallet.create(payload)

    wallet.addBalance(10)
    wallet.subtractBalance(5)

    expect(wallet.balance).toBe(5)
  })
})
