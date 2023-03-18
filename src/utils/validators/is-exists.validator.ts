import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export class IsExist implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async validate(value: any, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0];
    const path_to_property = validationArguments.constraints[1];
    const where_options = validationArguments.constraints[2];
    const entity: unknown = await this.dataSource
      .getRepository(repository)
      .findOne({
        where: {
          [path_to_property ? path_to_property : validationArguments.property]:
            path_to_property &&
            typeof value === 'object' &&
            path_to_property in value
              ? value?.[path_to_property]
              : value,
          ...where_options,
        },
        loadEagerRelations: false,
      });
    validationArguments.constraints[0] =
      this.dataSource.getMetadata(repository).givenTableName;
    return Boolean(entity);
  }
}
