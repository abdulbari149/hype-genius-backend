import { HttpStatus } from '@nestjs/common';

export default class ResponseEntity<T> {
  public message: string;
  public data: T;
  public status: HttpStatus;

  constructor(data: T);
  constructor(data: T, message: string);
  constructor(data: T, message: string, status: HttpStatus);
  constructor(data: T, message?: string, status?: HttpStatus) {
    this.message = message ?? 'Server returned a vaid response';
    this.data = data;
    this.status = status ?? HttpStatus.OK;
  }
}
