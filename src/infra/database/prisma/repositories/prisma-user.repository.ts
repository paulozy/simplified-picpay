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

    await this.prisma.user.upsert({
      where: { id: rawData.id },
      create: rawData,
      update: {
        name: rawData.name,
        type: rawData.type,
        updated_at: rawData.updated_at
      }
    })
  }
  
  async findByEmail(email: string): Promise<User> {
    const rawData = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if(!rawData) return null;

    const user = UserMapper.toDomain(rawData);

    return user;
  }
  
  async findById(id: string): Promise<User> {
    const rawData = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if(!rawData) return null;

    const user = UserMapper.toDomain(rawData);

    return user;
  }
}