import { User } from "@core/domain/entities/user";
import { UserExistsInput, UserRepository } from "@core/domain/repositories/user-repository.interface";

export class InMemoryUserRepository implements UserRepository {
  users: User[] = []

  async exists({email, document}: UserExistsInput): Promise<boolean> {
    const user = this.users.find(user => user.email === email || user.document === document)
    return !!user
  }
  
  async save(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.id === user.id)

    if(index >= 0) {
      this.users[index] = user
      return
    }

    this.users.push(user)
  }
  
  async findByEmail(email: string): Promise<User> {
    const user = this.users.find(user => user.email === email)
    return user
  }
  
  async findById(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id)
    return user
  }
}