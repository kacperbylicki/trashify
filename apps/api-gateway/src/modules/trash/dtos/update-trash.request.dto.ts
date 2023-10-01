import { ApiProperty } from '@nestjs/swagger';
import { GeolocationProperty } from '../../../common/decorators/openapi/geolocation-property.decorator';
import { TrashTagsProperty } from '../../../common/decorators/openapi/trash-tags-property.decorator';
import { UpdateTrashPayload, UpdateTrashRequest, UpdateTrashResponse } from '@trashify/transport';

export class UpdateTrashPayloadDto implements Omit<UpdateTrashPayload, 'uuid'> {
  @TrashTagsProperty()
  tag?: string | undefined;

  @GeolocationProperty({
    required: false,
  })
  location!: [number, number];
}

export class UpdateTrashRequestDto implements UpdateTrashRequest {
  @ApiProperty({ type: () => UpdateTrashPayloadDto })
  trash!: UpdateTrashPayload;
}

export class UpdateTrashResponseDto implements UpdateTrashResponse {
  @ApiProperty({
    type: Number,
    example: 200,
  })
  status!: number;
}
