import { ApiProperty } from '@nestjs/swagger';
import { GetTrashInDistanceRequest, GetTrashInDistanceResponse } from '@trashify/transport';
import { TrashDto } from './trash.dto';

export class GetTrashInDistanceQueryParamsDto implements GetTrashInDistanceRequest {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Minimum distance in meters from the geographical position.',
    default: 5,
  })
  minDistance?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Maximum distance in meters from the geographical position.',
    default: 1500,
  })
  maxDistance?: number;

  @ApiProperty({
    required: true,
    type: Number,
    format: 'float',
    description: 'Geographical latitude of users position.',
    example: 49.882786,
  })
  latitude!: number;

  @ApiProperty({
    required: true,
    type: Number,
    format: 'float',
    description: 'Geographical longitude of users position.',
    example: 19.493958,
  })
  longitude!: number;
}

export class GetTrashInDistanceResponseDto implements GetTrashInDistanceResponse {
  @ApiProperty({
    type: Number,
    example: 200,
  })
  status!: number;

  @ApiProperty({ type: () => TrashDto })
  trash!: TrashDto[];
}
