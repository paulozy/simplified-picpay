import { IsOptional, IsString } from "class-validator";

export class UpdateUserRules {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  constructor(props: UpdateUserRules) {
    Object.assign(this, props);
  }
}