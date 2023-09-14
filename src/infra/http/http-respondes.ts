import { HttpException, HttpStatus } from '@nestjs/common';

export class Conflict extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class BadRequest extends HttpException {
  constructor(message: any) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFound extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class InternalServerError extends HttpException {
  constructor() {
    super('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}