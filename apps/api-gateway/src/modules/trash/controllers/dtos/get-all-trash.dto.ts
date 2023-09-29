import { ApiProperty } from '@nestjs/swagger';
import { GetAllTrashResponse, Trash } from '@trashify/transport';
import { TrashDto } from './trash.dto';

export class GetAllTrashResponseDto implements GetAllTrashResponse {
  @ApiProperty({
    type: Number,
    example: 200,
  })
  status!: number;

  @ApiProperty({ type: () => TrashDto })
  trash!: Trash[];
}
