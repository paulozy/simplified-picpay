import { DatabaseModule } from "@infra/database/database.module"
import { PrismaService } from "@infra/database/prisma/prisma.service"
import { GatewayModule } from "@infra/gateways/gateway.module"
import { Test, TestingModule } from "@nestjs/testing"
import { HttpModule } from "../http.module"
import { UserController } from "./user.controller"

describe('user controller', () => {
  let controller: UserController
  let prisma: PrismaService
  
  beforeAll(() => prisma = new PrismaService())

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ DatabaseModule, GatewayModule, HttpModule ]
    }).compile()

    controller = app.get<UserController>(UserController)
  })

  afterEach(async () => {    
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should register a new user', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00"
    }

    const response = await controller.register(payload)

    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('name', payload.name)
    expect(response).toHaveProperty('email', payload.email)
    expect(response).toHaveProperty('document', payload.document)
    expect(response).toHaveProperty('wallet', { balance: 0, updatedAt: expect.any(Number) })
    expect(response).toHaveProperty('createdAt', expect.any(Number))
    expect(response).toHaveProperty('updatedAt', expect.any(Number))
  })
  
  it('should not register a new user with too short name', async () => {
    const payload = {
      name: "Jo",
      email: "john@doe.com",
      document: "123.456.789-00"
    }

    await expect(controller.register(payload)).rejects.toThrowError('Name must be at least 3 characters long')
  })

  it('should not register a new user with too long name', async () => {
    const payload = {
      name: "Jo".repeat(256),
      email: "john@doe.com",
      document: "123.456.789-00"
    }

    await expect(controller.register(payload)).rejects.toThrowError('Name must be a maximum of 255 characters long')
  })

  it('should not register a new user with invalid email', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe",
      document: "123.456.789-00"
    }

    await expect(controller.register(payload)).rejects.toThrowError('email must be an email')
  })

  it('should not register a new user with invalid document', async () => {
    const payload = {
      name: "John Doe",
      email: "jhon@doe.com",
      document: "123.456.789-0"
    }

    await expect(controller.register(payload)).rejects.toThrowError(JSON.stringify('document must be a cpf. Like "000.000.000-00"'))
  })

  it('should not register a new user with invalid type', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00",
      type: "invalid"
    }

    await expect(controller.register(payload)).rejects.toThrowError(JSON.stringify('type must be "common" or "shopkeeper"'))
  })

  it('should show a user', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00",
    }

    const user = await controller.register(payload)

    const response = await controller.show(user.id)

    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('name', payload.name)
    expect(response).toHaveProperty('email', payload.email)
    expect(response).toHaveProperty('document', payload.document)
    expect(response).toHaveProperty('wallet', { balance: 0, updatedAt: expect.any(Number) })
    expect(response).toHaveProperty('createdAt', expect.any(Number))
    expect(response).toHaveProperty('updatedAt', expect.any(Number))
  })

  it('should not show a user with invalid id', async () => {
    await expect(controller.show('invalid')).rejects.toThrowError('User with id \"invalid\" not found')
  })

  it('should update a user name', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00",
    }

    const user = await controller.register(payload)

    const response = await controller.update(user.id, { name: "John Doe 2" })

    expect(response).toHaveProperty('name', "John Doe 2")
  })

  it('should update a user type', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00",
    }

    const user = await controller.register(payload)

    const response = await controller.update(user.id, { type: "shopkeeper" })

    expect(response).toHaveProperty('type', "shopkeeper")
  })

  it('should not update a user with invalid id', async () => {
    await expect(controller.update('invalid', { name: "John Doe 2" })).rejects.toThrowError('User with id \"invalid\" not found')
  })

  it('should not update a user with too short name', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00"
    }

    const user = await controller.register(payload)

    await expect(controller.update(user.id, { name: "Jo" })).rejects.toThrowError('Name must be at least 3 characters long')
  })

  it('should not update a user with too long name', async () => {
    const payload = {
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00"
    }

    const user = await controller.register(payload)

    await expect(controller.update(user.id, { name: "Jo".repeat(256) })).rejects.toThrowError('Name must be a maximum of 255 characters long')
  })
})
