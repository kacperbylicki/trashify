import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { TrashTagsEnum } from '../enums/trash-tags.enum';
import { Type } from 'class-transformer';
import { UpdateTrashPayload, UpdateTrashRequest } from '@trashify/transport';

export class UpdateTrashPayloadDto implements UpdateTrashPayload {
  @IsUUID()
  @IsNotEmpty()
  uuid!: string;

  tag?: TrashTagsEnum;

  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsArray()
  @IsNumber({}, { each: true })
  geolocation!: [number, number];
}

export class UpdateTrashRequestDto implements UpdateTrashRequest {
  @ValidateNested()
  @Type(() => UpdateTrashPayloadDto)
  @IsNotEmpty()
  trash!: UpdateTrashPayloadDto;
}
