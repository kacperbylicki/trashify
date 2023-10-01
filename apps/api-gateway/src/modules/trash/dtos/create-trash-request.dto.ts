import { ApiProperty } from '@nestjs/swagger';
import { CreateTrashPayload, CreateTrashRequest, CreateTrashResponse } from '@trashify/transport';
import { GeolocationProperty } from '../../../common/decorators/openapi/geolocation-property.decorator';
import { TrashTagsProperty } from '../../../common/decorators/openapi/trash-tags-property.decorator';

export class CreateTrashPayloadDto implements CreateTrashPayload {
  @GeolocationProperty()
  location!: [number, number];

  @TrashTagsProperty()
  tag!: string;
}

export class CreateTrashRequestDto implements CreateTrashRequest {
  @ApiProperty({ type: () => CreateTrashPayloadDto })
  trash!: CreateTrashPayload;
}

export class CreateTrashResponseDto implements CreateTrashResponse {
  @ApiProperty({
    type: Number,
    example: 200,
  })
  status!: number;
}
