import { InvalidNameError } from "@core/domain/entities/@errors/invalid-name.error";
import { InvalidTypeError } from "@core/domain/entities/@errors/invalid-type.error";
import { User } from "@core/domain/entities/user";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Either, left, right } from "@core/logic/either";
import { UserNotFoundError } from "../@errors/user-not-found.error";

export type UpdateUserInput = {
  id: string;
  name?: string;
  type?: string;
}

type UpdateUserResponse = Either<
  UserNotFoundError 
  | InvalidNameError
  | InvalidTypeError, 
  User
>

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserResponse> {
    const {id, name, type } = input

    const user = await this.userRepository.findById(id)

    if(!user) return left(new UserNotFoundError(id))

    const updatedUserOrError = user.update({ name, type })

    if(updatedUserOrError.isLeft()) return left(updatedUserOrError.value)

    const updatedUser = updatedUserOrError.value as User

    await this.userRepository.save(updatedUser)

    return right(user)
  }
}