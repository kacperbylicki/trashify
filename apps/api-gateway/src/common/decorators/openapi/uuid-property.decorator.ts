import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

type UuidPropertyOptions = Omit<ApiPropertyOptions, 'type' | 'format'>;

export function UuidProperty(options?: UuidPropertyOptions): PropertyDecorator {
  //eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol) => {
    ApiProperty({
      type: String,
      format: 'uuid',
      ...options,
    })(target, propertyKey);
  };
}
