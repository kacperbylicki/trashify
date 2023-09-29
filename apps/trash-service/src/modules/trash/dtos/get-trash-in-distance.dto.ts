import { GetTrashInDistanceRequest } from '@trashify/transport';

export class GetTrashInDistanceRequestDto implements GetTrashInDistanceRequest {
  minDistance?: number;
  maxDistance?: number;
  latitude!: number;
  longitude!: number;
}
