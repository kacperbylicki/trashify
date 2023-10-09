import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

type GeolocationPropertyOptions = Omit<
  ApiPropertyOptions,
  'type' | 'items' | 'example' | 'description'
>;

export function GeolocationProperty(options?: GeolocationPropertyOptions): PropertyDecorator {
  //eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol) => {
    ApiProperty({
      type: Array,
      items: {
        type: 'float',
        minItems: 2,
        maxItems: 2,
      },
      example: [19.493958, 49.882786],
      description: 'Geographical longitude and latitude of the trash container.',
      ...options,
    })(target, propertyKey);
  };
}
