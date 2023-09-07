import { User } from "@core/domain/entities/user";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Either, left, right } from "@core/logic/either";
import { UserNotFoundError } from "../@errors/user-not-found.error";

type ShowUserResponse = Either<UserNotFoundError, User>

export class ShowUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<ShowUserResponse> {
    const user = await this.userRepository.findById(id)

    if(!user) return left(new UserNotFoundError(id))

    return right(user)
  }
}