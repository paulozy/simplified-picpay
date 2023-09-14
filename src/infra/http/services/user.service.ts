import { IUserUseCases } from "@core/app/factories/user-usecases.factory";
import { UserAlreadyExistsError } from "@core/app/usecases/@errors/user-already-exists.error";
import { UserNotFoundError } from "@core/app/usecases/@errors/user-not-found.error";
import { RegisterUserInput } from "@core/app/usecases/users/register-user.usecase";
import { UpdateUserInput } from "@core/app/usecases/users/update-user.usecase";
import { InvalidCPFOrCNPJError } from "@core/domain/entities/@errors/invalid-cpf-or-cnpj.error";
import { InvalidEmailError } from "@core/domain/entities/@errors/invalid-email.error";
import { InvalidNameError } from "@core/domain/entities/@errors/invalid-name.error";
import { InvalidTypeError } from "@core/domain/entities/@errors/invalid-type.error";
import { Inject, Injectable } from "@nestjs/common";
import { BadRequest, Conflict, InternalServerError } from "../http-respondes";
import { UserViewModel } from "../view-models/user.view-model";

@Injectable()
export class UserService {
  constructor(
    @Inject('UserUseCases')
    private readonly userUseCases: IUserUseCases
  ) {}

  async register(data: RegisterUserInput) {
    const { register } = this.userUseCases

    const userOrError = await register.execute(data)

    if(userOrError.isLeft()) {
      const error = userOrError.value
      
      switch(error.constructor) {
        case UserAlreadyExistsError:
          throw new Conflict(error.message)
        case InvalidNameError:
          throw new BadRequest(error.message)
        case InvalidEmailError:
          throw new BadRequest(error.message)
        case InvalidCPFOrCNPJError:
          throw new BadRequest(error.message)
        case InvalidTypeError:
          throw new BadRequest(error.message)
        default:
          throw new InternalServerError()
      }
    }

    const user = userOrError.value

    return UserViewModel.toHttp(user)
  }

  async show(id: string) {
    const { show } = this.userUseCases

    const userOrError = await show.execute(id)

    if(userOrError.isLeft()) {
      const error = userOrError.value
      
      switch(error.constructor) {
        case UserNotFoundError:
          throw new BadRequest(error.message)
        default:
          throw new InternalServerError()
      }
    }

    const user = userOrError.value

    return UserViewModel.toHttp(user)
  }

  async update(data: UpdateUserInput) {
    const { update } = this.userUseCases

    const userOrError = await update.execute(data)

    if(userOrError.isLeft()) {
      const error = userOrError.value

      switch(error.constructor) {
        case UserNotFoundError:
          throw new BadRequest(error.message)
        case InvalidNameError:
          throw new BadRequest(error.message)
        case InvalidTypeError:
          throw new BadRequest(error.message)
        default:
          throw new InternalServerError()
      }
    }

    const user = userOrError.value

    return UserViewModel.toHttp(user)
  }
}