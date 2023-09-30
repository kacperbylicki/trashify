import { ApiProperty } from '@nestjs/swagger';
import { Trash } from '@trashify/transport';
import { TrashTags, TrashTagsEnum } from '../../enums/trash-tags.enum';

export class TrashDto implements Trash {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  uuid!: string;

  @ApiProperty({
    type: Array,
    items: {
      type: 'float',
      minItems: 2,
      maxItems: 2,
    },
    example: [19.493958, 49.882786],
    description: 'Geographical longitude and latitude of the trash container.',
  })
  location!: [number, number];

  @ApiProperty({
    type: String,
    enum: TrashTags,
    enumName: 'TrashTags',
    example: TrashTags.batteries,
    minLength: 1,
  })
  tag!: TrashTagsEnum;
}
