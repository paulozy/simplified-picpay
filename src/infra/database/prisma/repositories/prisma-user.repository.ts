import { User } from "@core/domain/entities/user";
import { UserExistsInput, UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Injectable } from "@nestjs/common";
import { UserMapper } from "../mappers/user.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async exists({email, document}: UserExistsInput): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { document }
        ]
      }
    });
    
    return !!user;
  }
  
  async save(user: User): Promise<void> {
    const rawData = UserMapper.toPersistance(user);

    await this.prisma.user.create({
      data: rawData
    })
  }
  
  async findByEmail(email: string): Promise<User> {
    const rawData = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    const user = UserMapper.toDomain(rawData);

    return user;
  }
  
  async findById(id: string): Promise<User> {
    const rawData = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    const user = UserMapper.toDomain(rawData);

    return user;
  }
}