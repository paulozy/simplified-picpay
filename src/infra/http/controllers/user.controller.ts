import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { RegisterUserRules } from "../dtos/register-user.dto";
import { UpdateUserRules } from "../dtos/update-user.dto";
import { BadRequest } from "../http-respondes";
import { UserService } from "../services/user.service";
import { RegisterUserValidatorFactory } from "../validators/register-user.validator";
import { UpdateUserValidatorFactory } from "../validators/update-user.validator";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() body: RegisterUserRules) {
    const validator = RegisterUserValidatorFactory.create();
    const isValid = validator.validate(body);

    if (!isValid) {
      throw new BadRequest(validator.errors);
    }

    const user = await this.userService.register(body);

    return user;
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    const user = await this.userService.show(id);

    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserRules) {
    const validator = UpdateUserValidatorFactory.create();
    const isValid = validator.validate(body);

    if (!isValid) {
      throw new BadRequest(validator.errors);
    }

    const user = await this.userService.update({
      id,
      ...body,
    });

    return user;
  }
}