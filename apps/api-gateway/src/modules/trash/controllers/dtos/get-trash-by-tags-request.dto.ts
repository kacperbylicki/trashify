import { ApiProperty } from '@nestjs/swagger';
import { GetTrashByTagsRequest, GetTrashByTagsResponse, Trash } from '@trashify/transport';
import { TrashDto } from './trash.dto';
import { TrashTags } from '../../enums/trash-tags.enum';

export class GetTrashByTagsRequestDto implements GetTrashByTagsRequest {
  @ApiProperty({
    type: String,
    enum: TrashTags,
    enumName: 'TrashTags',
    example: [TrashTags.batteries, TrashTags.bottleMachine],
    minLength: 1,
  })
  tags!: string[];
}

export class GetTrashByTagsResponseDto implements GetTrashByTagsResponse {
  @ApiProperty({
    type: Number,
    example: 200,
  })
  status!: number;

  @ApiProperty({ type: () => TrashDto })
  trash!: Trash[];
}
