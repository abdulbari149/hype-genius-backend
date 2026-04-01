import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import CreateUserDto from 'src/app/users/dto/create-user.dto';

export default class AuthRegisterBusinessDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  businessLink: string;
}
