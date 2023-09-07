import { InvalidCPFOrCNPJError } from "@core/domain/entities/@errors/invalid-cpf-or-cnpj.error"
import { InvalidEmailError } from "@core/domain/entities/@errors/invalid-email.error"
import { InvalidNameError } from "@core/domain/entities/@errors/invalid-name.error"
import { InvalidTypeError } from "@core/domain/entities/@errors/invalid-type.error"
import { User } from "@core/domain/entities/user"
import { UserRepository } from "@core/domain/repositories/user-repository.interface"
import { UserAlreadyExistsError } from "../@errors/user-already-exists.error"
import { InMemoryUserRepository } from "../__tests__/repositories/in-memory-user-repository"
import { RegisterUserUseCase } from "./register-user.usecase"

describe('register user usecase', () => {
  let userRepository: UserRepository
  let usecase: RegisterUserUseCase

  const payload = {
    name: 'John Doe',
    email: 'john_doe@email.com',
    document: '123.456.789-00',
  }

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    usecase = new RegisterUserUseCase(userRepository)
  })

  it('should register a new user', async () => {
    const userOrError = await usecase.execute(payload)

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User
    
    expect(user.id).toBeDefined()
    expect(user.name).toEqual(payload.name)
    expect(user.email).toEqual(payload.email)
    expect(user.document).toEqual(payload.document)
    expect(user.type).toEqual('common')
    expect(user.wallet).toBeDefined()
    expect(user.wallet.balance).toEqual(0)
    expect(user.created_at).toBeDefined()
    expect(user.updated_at).toBeDefined()
  })

  it('should register a new shopkeeper', async () => {
    const userOrError = await usecase.execute({
      ...payload,
      type: 'shopkeeper'
    })

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User
        
    expect(user.id).toBeDefined()
    expect(user.name).toEqual(payload.name)
    expect(user.email).toEqual(payload.email)
    expect(user.document).toEqual(payload.document)
    expect(user.type).toEqual('shopkeeper')
    expect(user.wallet).toBeDefined()
    expect(user.wallet.balance).toEqual(0)
    expect(user.created_at).toBeDefined()
    expect(user.updated_at).toBeDefined()
  })

  it('should not register a new user with an existing email', async () => {
    await usecase.execute(payload)

    const userOrError = await usecase.execute(payload)

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not register a new user with an existing document', async () => {
    await usecase.execute(payload)

    const userOrError = await usecase.execute({
      ...payload,
      email: 'jhon_doe2@email.com'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not register a new user with an invalid name', async () => {
    const userOrError = await usecase.execute({
      ...payload,
      name: 'Jo'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidNameError)
  })

  it('should not register a new user with an invalid email', async () => {
    const userOrError = await usecase.execute({
      ...payload,
      email: 'john_doeemail.com'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should not register a new user with an invalid document', async () => {
    const userOrError = await usecase.execute({
      ...payload,
      document: '123.456.789-0'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidCPFOrCNPJError)
  })

  it('should not register a new user with an invalid type', async () => {
    const userOrError = await usecase.execute({
      ...payload,
      type: 'invalid'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidTypeError)
  })
})
