import { ClassValidatorFields } from 'src/infra/@shared/validators/class-validator-fields';
import { UpdateUserRules } from '../dtos/update-user.dto';

export class UpdateUserValidator extends ClassValidatorFields<UpdateUserRules> {
  validate(data: UpdateUserRules): boolean {
    return super.validate(new UpdateUserRules(data));
  }
}

export class UpdateUserValidatorFactory {
  static create(): UpdateUserValidator {
    return new UpdateUserValidator();
  }
}