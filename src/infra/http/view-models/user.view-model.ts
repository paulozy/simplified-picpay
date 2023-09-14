import { User } from "@core/domain/entities/user";

export class UserViewModel {
  static toHttp(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      document: user.document,
      type: user.type,
      wallet: {
        balance: user.wallet.balance,
        updated_at: user.wallet.updated_at,
      },
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  }
}