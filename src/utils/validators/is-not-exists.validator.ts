import { ConflictException, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { DataSource } from 'typeorm';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@ValidatorConstraint({ name: 'IsNotExist', async: true })
@Injectable()
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const currentValue = validationArguments.object as ValidationEntity;
    if (
      !validationArguments.object.hasOwnProperty(validationArguments.property)
    ) {
      return true;
    }
    const entity = await this.dataSource.getRepository(repository).findOneBy({
      [validationArguments.property]: value,
    });
    if (entity?.id === currentValue?.id) {
      return true;
    }

    throw new ConflictException(
      `${validationArguments.property} already exists`,
    );
  }
}
