import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserRules {
  @IsString()
  @MinLength(3, {
    message: 'Name must be at least 3 characters long',
  })
  @MaxLength(255, {
    message: 'Name must be a maximum of 255 characters long',
  })
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['common', 'shopkeeper'], {
    message: 'type must be "common" or "shopkeeper"'
  })
  type?: string;

  constructor(props: UpdateUserRules) {
    Object.assign(this, props);
  }
}