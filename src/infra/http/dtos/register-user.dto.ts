import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class RegisterUserRules {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
  // @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
  document: string;

  @IsString()
  @IsOptional()
  type?: string;

  constructor(props: RegisterUserRules) {
    Object.assign(this, props);
  }
}