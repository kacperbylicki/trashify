import { DeleteTrashRequest } from '@trashify/transport';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTrashRequestDto implements DeleteTrashRequest {
  @IsUUID()
  @IsNotEmpty()
  uuid!: string;
}
