import { InvalidCPFOrCNPJError } from "@core/domain/entities/@errors/invalid-cpf-or-cnpj.error";
import { InvalidEmailError } from "@core/domain/entities/@errors/invalid-email.error";
import { InvalidNameError } from "@core/domain/entities/@errors/invalid-name.error";
import { InvalidTypeError } from "@core/domain/entities/@errors/invalid-type.error";
import { User } from "@core/domain/entities/user";
import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { Either, left, right } from "@core/logic/either";
import { UserAlreadyExistsError } from "../@errors/user-already-exists.error";

export type RegisterUserInput = {
  name: string;
  email: string;
  document: string;
  type?: string;
}

type RegisterUserResponse = Either<
  UserAlreadyExistsError 
  | InvalidNameError 
  | InvalidEmailError 
  | InvalidCPFOrCNPJError 
  | InvalidTypeError, 
  User
>

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResponse> {
    const { name, email, document, type } = input

    const hasUser = await this.userRepository.exists({
      email,
      document
    })

    if(hasUser) return left(new UserAlreadyExistsError(email, document))

    const userOrError = User.create({
      name,
      email,
      document,
      type: type ?? 'common'
    })

    if(userOrError.isLeft()) return left(userOrError.value)

    const user = userOrError.value

    await this.userRepository.save(user)

    return right(user)
  }
}