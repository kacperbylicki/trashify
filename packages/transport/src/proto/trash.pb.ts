/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const trashProtobufPackage = 'trash';

export interface Trash {
  uuid: string;
  geolocation: [number, number];
  tag:
    | 'batteries'
    | 'bio'
    | 'bottleMachine'
    | 'mixed'
    | 'municipal'
    | 'paper'
    | 'petFeces'
    | 'plastic'
    | 'toners'
    | 'glass';
}

export interface CreateTrashPayload {
  geolocation: [number, number];
  tag: string;
}

export interface UpdateTrashPayload {
  uuid: string;
  tag?: string | undefined;
  geolocation: [number, number];
}

export interface GetAllTrashRequest {}

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

export interface CreateTrashRequest {
  trash: CreateTrashPayload;
}

export interface CreateTrashResponse {
  status: number;
}

export interface UpdateTrashRequest {
  trash: UpdateTrashPayload;
}

export interface UpdateTrashResponse {
  status: number;
}

export interface DeleteTrashRequest {
  uuid: string;
}

export interface DeleteTrashResponse {
  status: number;
}

export const TRASH_PACKAGE_NAME = 'trash';

export abstract class TrashServiceClient {
  abstract getAllTrash(request: GetAllTrashRequest): Observable<GetAllTrashResponse>;

  abstract getTrashByTags(request: GetTrashByTagsRequest): Observable<GetTrashByTagsResponse>;

  abstract getTrashInDistance(
    request: GetTrashInDistanceRequest,
  ): Observable<GetTrashInDistanceResponse>;

  abstract createTrash(request: CreateTrashRequest): Observable<CreateTrashResponse>;

  abstract updateTrash(request: UpdateTrashRequest): Observable<UpdateTrashResponse>;

  abstract deleteTrash(request: DeleteTrashRequest): Observable<DeleteTrashResponse>;
}

export interface TrashServiceController {
  getAllTrash(request: GetAllTrashRequest): Promise<GetAllTrashResponse> | GetAllTrashResponse;

  getTrashByTags(
    request: GetTrashByTagsRequest,
  ): Promise<GetTrashByTagsResponse> | GetTrashByTagsResponse;

  getTrashInDistance(
    request: GetTrashInDistanceRequest,
  ): Promise<GetTrashInDistanceResponse> | GetTrashInDistanceResponse;

  createTrash(
    request: CreateTrashRequest,
  ): Promise<CreateTrashResponse> | Observable<CreateTrashResponse> | CreateTrashResponse;

  updateTrash(
    request: UpdateTrashRequest,
  ): Promise<UpdateTrashResponse> | Observable<UpdateTrashResponse> | UpdateTrashResponse;

  deleteTrash(
    request: DeleteTrashRequest,
  ): Promise<DeleteTrashResponse> | Observable<DeleteTrashResponse> | DeleteTrashResponse;
}

export function TrashServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getAllTrash',
      'getTrashByTags',
      'getTrashInDistance',
      'createTrash',
      'updateTrash',
      'deleteTrash',
    ];
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
