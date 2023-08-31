import { InvalidCPFOrCNPJError } from "./@errors/invalid-cpf-or-cnpj.error"
import { InvalidEmailError } from "./@errors/invalid-email.error"
import { InvalidNameError } from "./@errors/invalid-name.error"
import { InvalidTypeError } from "./@errors/invalid-type.error"
import { User } from "./user"

describe('User Entity', () => {
  let payload

  beforeEach(() => {
    payload = {
      name: 'John Doe',
      email: 'john@doe.com',
      document: '022.840.180-17',
      type: 'common'
    }
  })

  it('should be possible to create a common user', () => {
    const userOrError = User.create(payload)

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User

    expect(user.id).toBeDefined()
    expect(user.name).toBe(payload.name)
    expect(user.email).toBe(payload.email)
    expect(user.document).toBe(payload.document)
    expect(user.type).toBe(payload.type)
    expect(user.created_at).toBeDefined()
    expect(user.updated_at).toBeDefined()
    expect(user.wallet.balance).toBe(0)
  })

  it('should be possible to create a common user with cnpj', () => {
    payload = {
      ...payload,
      document: '02.840.180/0001-17',
    }

    const userOrError = User.create(payload)

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User

    expect(user.document).toBe(payload.document)
  })

  it('should be possible to create a shopkeeper user', () => {
    payload = {
      ...payload,
      type: 'shopkeeper'
    }

    const userOrError = User.create(payload)

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User

    expect(user.id).toBeDefined()
    expect(user.type).toBe(payload.type)
  })

  it('should not be possible to create a user with invalid name', () => {
    payload = {
      ...payload,
      name: 'Jo'
    }

    const userOrError = User.create(payload)

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidNameError)
  })

  it('should not be possible to create a user with invalid email', () => {
    payload = {
      ...payload,
      email: 'john@doe'
    }

    const userOrError = User.create(payload)

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should not be possible to create a user with invalid cpf', () => {
    payload = {
      ...payload,
      document: '022.840.18018'
    }

    const userOrError = User.create(payload)

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidCPFOrCNPJError)
  })

  it('should not be possible to create a user with invalid cnpj', () => {
    payload = {
      ...payload,
      document: '02.8401800001-1'
    }

    const userOrError = User.create(payload)

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidCPFOrCNPJError)
  })

  it('should not be possible to create a user with invalid type', () => {
    payload = {
      ...payload,
      type: 'invalid'
    }

    const userOrError = User.create(payload)

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidTypeError)
  })
})
