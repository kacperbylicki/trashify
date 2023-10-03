import { GeolocationProperty } from '../../../common/decorators/openapi/geolocation-property.decorator';
import { Trash } from '@trashify/transport';
import { TrashTagsEnum } from '../enums/trash-tags.enum';
import { TrashTagsProperty } from '../../../common/decorators/openapi/trash-tags-property.decorator';
import { UuidProperty } from '../../../common/decorators/openapi/uuid-property.decorator';

export class TrashDto implements Trash {
  @UuidProperty()
  uuid!: string;

  @GeolocationProperty()
  geolocation!: [number, number];

  @TrashTagsProperty()
  tag!: TrashTagsEnum;
}
