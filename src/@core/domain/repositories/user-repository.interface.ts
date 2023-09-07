import { User } from "../entities/user";

export abstract class UserRepository {
  abstract exists(email: string): Promise<boolean>
  abstract save(user: User): Promise<void>
  abstract findByEmail(email: string): Promise<User>
  abstract findById(id: string): Promise<User>
}