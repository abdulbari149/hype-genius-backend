import { IsString } from 'class-validator';

export class CreateNotesDto {
  @IsString()
  body: string;
}
