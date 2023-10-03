import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CreateTrashPayload, CreateTrashRequest } from '@trashify/transport';
import { TrashTags, TrashTagsEnum } from '../enums/trash-tags.enum';
import { Type } from 'class-transformer';

export class CreateTrashPayloadDto implements CreateTrashPayload {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  geolocation!: [number, number];

  @IsNotEmpty()
  @IsEnum(TrashTags)
  tag!: TrashTagsEnum;
}

export class CreateTrashRequestDto implements CreateTrashRequest {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreateTrashPayloadDto)
  trash!: CreateTrashPayloadDto;
}
