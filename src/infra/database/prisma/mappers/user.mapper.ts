import { User } from "@core/domain/entities/user";
import { Wallet } from "@core/domain/entities/wallet.vo";
import { User as RawUser } from "@prisma/client";
import { MapperUserError } from "src/infra/@shared/errors/mapper-user.error";

export class UserMapper {
    static toPersistance(user: User): RawUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            document: user.document,
            wallet: {
              balance: user.wallet.balance,
              updated_at: user.wallet.updated_at
            },
            type: user.type,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }

    static toDomain(rawUser: RawUser): User {
        const wallet = Wallet.create({
          balance: rawUser.wallet.balance,
          updated_at: rawUser.wallet.updated_at
        })

        const userOrError = User.create({
            id: rawUser.id,
            name: rawUser.name,
            document: rawUser.document,
            email: rawUser.email,
            type: rawUser.type,
            wallet,
            created_at: rawUser.created_at,
            updated_at: rawUser.updated_at
        })

        if (userOrError.isLeft()) {
          throw new MapperUserError(userOrError.value.name)
        }

        const user = userOrError.value        

        return user
    }
}