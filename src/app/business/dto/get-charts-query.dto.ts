import { Validate, IsOptional } from 'class-validator';
import { IsOnlyDate } from 'src/utils/validators/is-only-date.validator';

export class GetChartsDataQueryDto {
  @Validate(IsOnlyDate)
  @IsOptional()
  start_date?: Date;

  @Validate(IsOnlyDate)
  @IsOptional()
  end_date?: Date;
}
