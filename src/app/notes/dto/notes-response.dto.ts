import { Exclude, Expose, Type } from 'class-transformer';

@Exclude({ toClassOnly: true })
export class NotesResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  body: string;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
