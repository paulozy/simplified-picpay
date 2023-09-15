import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterUserRules {
  @IsString()
  @MinLength(3, {
    message: 'Name must be at least 3 characters long',
  })
  @MaxLength(255, {
    message: 'Name must be a maximum of 255 characters long',
  })
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'document must be a cpf. Like "000.000.000-00"'
  })
  // @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
  document: string;

  @IsString()
  @IsOptional()
  @IsEnum(['common', 'shopkeeper'], {
    message: 'type must be "common" or "shopkeeper"'
  })
  type?: string;

  constructor(props: RegisterUserRules) {
    Object.assign(this, props);
  }
}