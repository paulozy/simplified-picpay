import { User } from "@core/domain/entities/user"
import { UserRepository } from "@core/domain/repositories/user-repository.interface"
import { User as PrismaUser } from "@prisma/client"
import { MapperUserError } from "src/infra/@shared/errors/mapper-user.error"
import { PrismaService } from "../prisma.service"
import { PrismaUserRepository } from "./prisma-user.repository"

describe('Prisma User Repository', () => {
  let repository: UserRepository
  let prisma: PrismaService

  let defaultUser: PrismaUser

  beforeAll(() => prisma = new PrismaService())

  beforeEach(async () => {
    defaultUser = await prisma.user.create({
      data: {
        name: 'any_name',
        document: '111.222.333-44',
        email: 'any_email@email.com',
        type: 'common',
        wallet: {
          balance: 0,
          updated_at: new Date().getTime()
        },
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      }
    })

    repository = new PrismaUserRepository(prisma)
  })

  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return true if user exists', async () => {
    const exists = await repository.exists({ email: 'any_email@email.com', document: 'any_document' })

    expect(exists).toBe(true)
  })

  it('should return false if user not exists', async () => {
    const exists = await repository.exists({ email: 'other_email', document: 'other_document' })

    expect(exists).toBe(false)
  })

  it('should create a new user', async () => {
    const user = User.create({
      name: 'any_name',
      document: '111.222.333-34',
      email: 'any_email2@email.com',
      type: 'common'
    }).value as User
    
    await repository.save(user)

    const savedUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    expect(savedUser).toBeTruthy()
    expect(savedUser?.name).toBe(user.name)
    expect(savedUser?.document).toBe(user.document)
    expect(savedUser?.email).toBe(user.email)
    expect(savedUser?.type).toBe(user.type)
    expect(savedUser?.wallet.balance).toBe(user.wallet.balance)
  })

  it('should return user by email', async () => {
    const user = await repository.findByEmail('any_email@email.com')

    expect(user).toBeTruthy()
    expect(user?.email).toBe('any_email@email.com')
  })

  it('should return null if user not found by email', async () => {
    const user = await repository.findByEmail('other_email')

    expect(user).toBeNull()
  })

  it('should return user by id', async () => {
    const user = await repository.findById(defaultUser.id)

    expect(user).toBeTruthy()
    expect(user?.id).toBe(defaultUser.id)
  })

  it('should return null if user not found by id', async () => {
    const user = await repository.findById('other_id')

    expect(user).toBeNull()
  })

  it('should throw if user mapper throws', async () => {
    const spy = jest.spyOn(prisma.user, 'findUnique').mockImplementationOnce(() => {
      throw new MapperUserError('any_error')
    })

    await expect(() => repository.findById(defaultUser.id)).rejects.toThrow()
  })
})
