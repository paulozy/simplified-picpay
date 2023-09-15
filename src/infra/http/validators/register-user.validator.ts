import { ClassValidatorFields } from 'src/infra/@shared/validators/class-validator-fields';
import { RegisterUserRules } from '../dtos/register-user.dto';

export class RegisterUserValidator extends ClassValidatorFields<RegisterUserRules> {
  validate(data: RegisterUserRules): boolean {
    return super.validate(new RegisterUserRules(data));
  }
}

export class RegisterUserValidatorFactory {
  static create(): RegisterUserValidator {
    return new RegisterUserValidator();
  }
}