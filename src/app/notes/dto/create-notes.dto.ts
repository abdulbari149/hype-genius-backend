import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotesDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateBusinessChannelNotesDto extends CreateNotesDto {
  @IsBoolean()
  @IsNotEmpty()
  pinned: boolean;
}
