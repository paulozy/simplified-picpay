import { User } from "../entities/user";

export type UserExistsInput = {
  email?: string
  document?: string
}

export abstract class UserRepository {
  abstract exists(input: UserExistsInput): Promise<boolean>
  abstract save(user: User): Promise<void>
  abstract findByEmail(email: string): Promise<User>
  abstract findById(id: string): Promise<User>
}