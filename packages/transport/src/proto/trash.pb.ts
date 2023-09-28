/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const trashProtobufPackage = 'trash';

export interface Trash {
  id: string;
  latitude: number;
  longitude: number;
  tags: string[];
}

export interface GetAllTrashRequest {}

export interface GetAllTrashResponse {
  ok: boolean;
  trash: Trash[];
}

export interface GetTrashByTagsResponse {
  ok: boolean;
  trash: Trash[];
}

export interface GetTrashByTagsRequest {
  tags: string[];
}

export interface GetTrashInDistanceRequest {
  distance: number;
}

export interface GetTrashInDistanceResponse {
  ok: boolean;
  trash: Trash[];
}

export interface GetTrashByRequest {
  distance?: number | undefined;
  tags: string[];
}

export interface GetTrashByResponse {
  ok: boolean;
  trash: Trash[];
}

export const TRASH_PACKAGE_NAME = 'trash';

export abstract class TrashServiceClient {
  abstract getAllTrash(
    request: GetAllTrashRequest,
  ): GetAllTrashResponse | Promise<GetAllTrashResponse> | Observable<GetAllTrashResponse>;

  abstract getTrashByTags(
    request: GetTrashByTagsRequest,
  ): GetTrashByTagsResponse | Promise<GetTrashByTagsResponse> | Observable<GetTrashByTagsResponse>;

  abstract getTrashInDistance(
    request: GetTrashInDistanceRequest,
  ):
    | GetTrashInDistanceResponse
    | Promise<GetTrashInDistanceResponse>
    | Observable<GetTrashInDistanceResponse>;
}

export interface TrashServiceController {
  getAllTrash(request: GetAllTrashRequest): Promise<GetAllTrashResponse> | GetAllTrashResponse;

  getTrashByTags(
    request: GetTrashByTagsRequest,
  ): Promise<GetTrashByTagsResponse> | GetTrashByTagsResponse;

  getTrashInDistance(
    request: GetTrashInDistanceRequest,
  ): Promise<GetTrashInDistanceResponse> | GetTrashInDistanceResponse;
}

export function TrashServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getAllTrash', 'getTrashByTags', 'getTrashInDistance'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('TrashService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('TrashService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRASH_SERVICE_NAME = 'TrashService';
