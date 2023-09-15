import { validateSync } from 'class-validator';

export type FieldsErrors = {
  [field: string]: string[];
};

export abstract class ClassValidatorFields<PropsToValidate> {
  errors: FieldsErrors = null;
  validatedData: PropsToValidate = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length) {
      this.errors = {};

      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validatedData = data;
    }

    return !errors.length;
  }
}