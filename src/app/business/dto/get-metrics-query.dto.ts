import { IsOptional, Validate } from 'class-validator';
import { IsOnlyDate } from 'src/utils/validators/is-only-date.validator';

export class GetMetricsQueryDto {
  @Validate(IsOnlyDate)
  @IsOptional()
  start_date?: string;

  @Validate(IsOnlyDate)
  @IsOptional()
  end_date?: string;
}
