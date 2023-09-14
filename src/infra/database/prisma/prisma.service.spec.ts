import { PrismaService } from "./prisma.service"

describe('Prisma Service', () => {
  let prisma: PrismaService

  beforeEach(() => {
    prisma = new PrismaService()
  })

  it('should be defined', () => {
    expect(prisma).toBeDefined()
  })

  it('should connect to database', async () => {
    const spy = jest.spyOn(prisma, '$connect')

    await prisma.onModuleInit()

    expect(spy).toHaveBeenCalled()
  })
})
