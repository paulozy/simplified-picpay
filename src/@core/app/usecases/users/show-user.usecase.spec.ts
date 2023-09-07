import { User } from "@core/domain/entities/user"
import { UserRepository } from "@core/domain/repositories/user-repository.interface"
import { UserNotFoundError } from "../@errors/user-not-found.error"
import { InMemoryUserRepository } from "../__tests__/repositories/in-memory-user-repository"
import { ShowUserUseCase } from "./show-user.usecase"

describe('register user usecase', () => {
  let userRepository: UserRepository
  let usecase: ShowUserUseCase

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

    usecase = new ShowUserUseCase(userRepository)
  })

  it('should show a user', async () => {
    const userOrError = await usecase.execute(defaultUser.id)

    expect(userOrError.isRight()).toBeTruthy()

    const user = userOrError.value as User
    
    expect(user.id).toBeDefined()
    expect(user.name).toEqual('John Doe')
    expect(user.email).toEqual('john_doe@email.com')
    expect(user.document).toEqual('123.456.789-00')
    expect(user.type).toEqual('common')
    expect(user.wallet).toBeDefined()
    expect(user.wallet.balance).toEqual(0)
    expect(user.created_at).toBeDefined()
    expect(user.updated_at).toBeDefined()
  })

  it('should not show a user', async () => {
    const userOrError = await usecase.execute('invalid-id')

    expect(userOrError.isLeft()).toBeTruthy()
    expect(userOrError.value).toBeInstanceOf(UserNotFoundError)
  })
})
