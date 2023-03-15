import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  public link: string;
}
