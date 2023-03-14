import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import { MESSAGES } from '../../../common/messages';

const {
  EMAIL: {
    ERROR: { EMAIL_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class AuthEmailLoginDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['users'], {
    message: EMAIL_DOES_NOT_EXIST,
  })
  email: string;

  @IsNotEmpty()
  password: string;
}
