import { GetTrashInDistanceRequest } from '@trashify/transport';
import { IsNumber, IsOptional } from 'class-validator';

export class GetTrashInDistanceRequestDto implements GetTrashInDistanceRequest {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsOptional()
  minDistance?: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsOptional()
  maxDistance?: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  latitude!: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  longitude!: number;
}
