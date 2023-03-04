import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import moment = require('moment');

@ValidatorConstraint()
export class IsOnlyDate implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  validate(value: any) {
    if (typeof value === 'string') {
      return (
        /^[1-9]\d*-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value) &&
        moment(value, 'YYYY-MM-DD').isValid()
      );
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  defaultMessage({ property }) {
    return `${property} must be a valid date (Required format: YYYY-MM-DD)`;
  }
}
