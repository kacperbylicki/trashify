import { ApiProperty } from '@nestjs/swagger';
import { TrashTags } from '../../../modules/trash/enums/trash-tags.enum';

export function TrashTagsProperty(): PropertyDecorator {
  //eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol) => {
    ApiProperty({
      type: String,
      enum: TrashTags,
      enumName: 'TrashTags',
      example: TrashTags.batteries,
      minLength: 1,
    })(target, propertyKey);
  };
}
