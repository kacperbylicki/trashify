import { GetTrashByTagsRequest } from '@trashify/transport';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TrashTags, TrashTagsEnum } from '../enums/trash-tags.enum';

export class GetTrashByTagsRequestDto implements GetTrashByTagsRequest {
  @IsNotEmpty()
  @IsEnum(TrashTags, { each: true })
  tags!: TrashTagsEnum[];
}
