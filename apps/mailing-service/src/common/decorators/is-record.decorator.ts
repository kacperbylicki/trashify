import { ValidationOptions, registerDecorator } from 'class-validator';
import { isRecordValidator } from '../validators/is-record.validator';

export const IsRecord = (validationOptions?: ValidationOptions) => {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      name: 'IsRecord',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Wrong object format',
        ...validationOptions,
      },
      validator: isRecordValidator,
    });
  };
};
