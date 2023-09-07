import { InvalidNameError } from "@core/domain/entities/@errors/invalid-name.error"
import { InvalidTypeError } from "@core/domain/entities/@errors/invalid-type.error"
import { User } from "@core/domain/entities/user"
import { UserRepository } from "@core/domain/repositories/user-repository.interface"
import { UserNotFoundError } from "../@errors/user-not-found.error"
import { InMemoryUserRepository } from "../__tests__/repositories/in-memory-user-repository"
import { UpdateUserUseCase } from "./update-user.usecase"

describe('register user usecase', () => {
  let userRepository: UserRepository
  let usecase: UpdateUserUseCase

  let defaultUser: User

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()

    defaultUser = User.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      document: '123.456.789-00',
      type: 'common'
    }).value as User

    await userRepository.save(defaultUser)

    usecase = new UpdateUserUseCase(userRepository)
  })

  it('should update a user', async () => {
    const userOrError = await usecase.execute({
      id: defaultUser.id,
      name: 'John Doe Updated',
      type: 'shopkeeper'
    })

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User
        
    expect(user.id).toBeDefined()
    expect(user.name).toEqual('John Doe Updated')
    expect(user.type).toEqual('shopkeeper')
    expect(user.created_at).toBeDefined()
    expect(user.updated_at).toBeDefined()
  })

  it('should not update a user', async () => {
    const userOrError = await usecase.execute({
      id: 'invalid-id',
      name: 'John Doe Updated',
      type: 'shopkeeper'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should not update a user with invalid name', async () => {
    const invalidName = 'J'.repeat(280)

    const userOrError = await usecase.execute({
      id: defaultUser.id,
      name: invalidName,
      type: 'shopkeeper'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidNameError)
  })

  it('should not update a user with invalid type', async () => {
    const userOrError = await usecase.execute({
      id: defaultUser.id,
      name: 'John Doe Updated',
      type: 'invalid-type'
    })

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(InvalidTypeError)
  })
})
