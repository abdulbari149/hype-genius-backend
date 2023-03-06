import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export default class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  public phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minNumbers: 2,
    minSymbols: 1,
    minUppercase: 1,
  })
  public password: string;

  @Validate(IsExist, ['roles', 'role'])
  @IsString()
  @IsNotEmpty()
  public role: string;
}
