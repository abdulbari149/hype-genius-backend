import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import CreateUserDto from 'src/app/users/dto/create-user.dto';

export default class AuthRegisterChannelDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  channelLink: string;
}
