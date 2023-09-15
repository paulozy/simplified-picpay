import { UserUseCases } from "@core/app/factories/user-usecases.factory"
import { left } from "@core/logic/either"
import { DatabaseModule } from "@infra/database/database.module"
import { PrismaService } from "@infra/database/prisma/prisma.service"
import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"

describe('user service', () => {
  let service: UserService
  let prisma: PrismaService

  beforeAll(async () => {
    prisma = new PrismaService()

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserUseCases],
      imports: [DatabaseModule]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should throw an error when trying to register a user that already exists', async () => {
    const payload = {
      name: 'john doe',
      email: 'john@doe.com',
      document: '123.456.789-02'
    }

    await service.register(payload)

    await expect(service.register(payload)).rejects.toThrowError()
  })

  it('should throw an error when trying to register a user with an invalid name', async () => {
    const payload = {
      name: 'jo',
      email: 'john@doe.com',
      document: '123.456.789-01'
    }


    await expect(service.register(payload)).rejects.toThrowError()
  })

  it('should throw an error when trying to register a user with an invalid email', async () => {
    const payload = {
      name: 'john doe',
      email: 'johndoe',
      document: '123.456.789-02'
    }

    await expect(service.register(payload)).rejects.toThrowError()
  })

  it('should throw an error when trying to register a user with an invalid document', async () => {
    const payload = {
      name: 'john doe',
      email: 'john@doe.com',
      document: '123.456.789-1'
    }

    await expect(service.register(payload)).rejects.toThrowError()
  })

  it('should throw an error when trying to register a user with an invalid type', async () => {
    const payload = {
      name: 'john doe',
      email: 'john@doe.com',
      document: '123.456.789-01',
      type: 'invalid'
    }

    await expect(service.register(payload)).rejects.toThrowError()
  })

  it('should throw if user use case throws an unexpected error', async () => {
    const payload = {
      name: 'john doe',
      email: 'john@doe.com',
      document: '123.456.789-01'
    }

    const { register } = service['userUseCases']

    jest.spyOn(register, 'execute').mockImplementationOnce(async () => {
      return left(new Error('unexpected error'))
    })

    await expect(service.register(payload)).rejects.toThrowError()
  })

  it('should throw if show user use case throws an unexpected error', async () => {
    const { show } = service['userUseCases']

    jest.spyOn(show, 'execute').mockImplementationOnce(async () => {
      return left(new Error('unexpected error'))
    })

    await expect(service.show('1')).rejects.toThrowError()
  })

  it('should throw an error when trying update a user with invalid name', async () => {
    const payload = {
      name: 'john doe',
      email: 'john@doe.com',
      document: '123.456.789-01'
    }

    const user = await service.register(payload)

    await expect(service.update({
      id: user.id,
      name: 'jo'
    })).rejects.toThrowError()
  })

  it('should throw an error when trying update a user with invalid type', async () => {
    const payload = {
      name: 'john doe',
      email: 'john@doe.com',
      document: '123.456.789-01'
    }

    const user = await service.register(payload)

    await expect(service.update({
      id: user.id,
      type: 'invalid'
    })).rejects.toThrowError()
  })

  it('should throw if update user use case throws an unexpected error', async () => {
    const { update } = service['userUseCases']

    jest.spyOn(update, 'execute').mockImplementationOnce(async () => {
      return left(new Error('unexpected error'))
    })

    await expect(service.update({
      id: '1',
      name: 'john doe'
    })).rejects.toThrowError()
  })
})
