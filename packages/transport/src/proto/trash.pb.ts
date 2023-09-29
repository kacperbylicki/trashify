/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const trashProtobufPackage = 'trash';

export interface Trash {
  uuid: string;
  location: number[];
  tags: string[];
}

export interface GetAllTrashRequest {
}

export interface GetAllTrashResponse {
  status: number;
  trash: Trash[];
}

export interface GetTrashByTagsResponse {
  status: number;
  trash: Trash[];
}

export interface GetTrashByTagsRequest {
  tags: string[];
}

export interface GetTrashInDistanceRequest {
  minDistance?: number;
  maxDistance?: number;
  latitude: number;
  longitude: number;
}

export interface GetTrashInDistanceResponse {
  status: number;
  trash: Trash[];
}

export const TRASH_PACKAGE_NAME = 'trash';

export abstract class TrashServiceClient {
  abstract getAllTrash(request: GetAllTrashRequest): Observable<GetAllTrashResponse>;

  abstract getTrashByTags(request: GetTrashByTagsRequest): Observable<GetTrashByTagsResponse>;

  abstract getTrashInDistance(request: GetTrashInDistanceRequest): Observable<GetTrashInDistanceResponse>;
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
