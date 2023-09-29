import { Controller, HttpStatus } from '@nestjs/common';
import {
  GetAllTrashResponse,
  GetTrashByTagsResponse,
  GetTrashInDistanceResponse,
  TRASH_SERVICE_NAME,
  TrashServiceController,
} from '@trashify/transport';
import { GetTrashByTagsRequestDto, GetTrashInDistanceRequestDto } from '../dtos';
import { GrpcMethod } from '@nestjs/microservices';
import { TrashService } from '../services';
import { grpcMethods } from '../enums/grpc-methods.enum';

@Controller()
export class TrashController implements TrashServiceController {
  constructor(private readonly trashService: TrashService) {}

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getAllTrash)
  public async getAllTrash(): Promise<GetAllTrashResponse> {
    const result = await this.trashService.getAll();

    return {
      status: HttpStatus.OK,
      trash: result,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getTrashByTags)
  public async getTrashByTags(request: GetTrashByTagsRequestDto): Promise<GetTrashByTagsResponse> {
    const { tags } = request;

    const result = await this.trashService.getByTags({ tags });

    return {
      status: HttpStatus.OK,
      trash: result,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getTrashInDistance)
  public async getTrashInDistance(
    payload: GetTrashInDistanceRequestDto,
  ): Promise<GetTrashInDistanceResponse> {
    const { latitude, longitude, maxDistance, minDistance } = payload;

    const result = await this.trashService.getInDistance({
      coordinates: [longitude, latitude],
      maxDistance,
      minDistance,
    });

    return {
      status: HttpStatus.OK,
      trash: result,
    };
  }
}
