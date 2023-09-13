import { UserRepository } from "@core/domain/repositories/user-repository.interface";
import { RegisterUserUseCase } from "../usecases/users/register-user.usecase";
import { ShowUserUseCase } from "../usecases/users/show-user.usecase";
import { UpdateUserUseCase } from "../usecases/users/update-user.usecase";

export interface UserUseCases {
  show: ShowUserUseCase
  register: RegisterUserUseCase
  update: UpdateUserUseCase
}

export const UserUseCases = {
  provide: 'UserUseCases',
  useFactory: (userRepository: UserRepository) => ({
    show: new ShowUserUseCase(userRepository),
    register: new RegisterUserUseCase(userRepository),
    update: new UpdateUserUseCase(userRepository),
  }),
  inject: [UserRepository],
}