import { IsNotEmpty, IsString } from 'class-validator';
export default class AddNoteDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}
