import { Controller, HttpStatus } from '@nestjs/common';
import {
  CreateTrashRequest,
  CreateTrashResponse,
  DeleteTrashRequest,
  DeleteTrashResponse,
  GetAllTrashResponse,
  GetTrashByTagsResponse,
  GetTrashInDistanceResponse,
  TRASH_SERVICE_NAME,
  TrashServiceController,
  UpdateTrashRequest,
  UpdateTrashResponse,
} from '@trashify/transport';
import { GetTrashByTagsRequestDto, GetTrashInDistanceRequestDto, TrashUpdateDto } from '../dtos';
import { GrpcMethod } from '@nestjs/microservices';
import { TrashDraft } from '../dtos/trash.draft';
import { TrashMapper } from '../mappers/trash-mapper';
import { TrashService } from '../services';
import { TrashTagsEnum } from '../enums/trash-tags.enum';
import { grpcMethods } from '../enums/grpc-methods.enum';

@Controller()
export class TrashController implements TrashServiceController {
  public constructor(private readonly trashService: TrashService) {}
  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getAllTrash)
  public async getAllTrash(): Promise<GetAllTrashResponse> {
    const result = await this.trashService.getAll();

    const mappedResult = TrashMapper.mapFromRawArray(result);

    return {
      status: HttpStatus.OK,
      trash: mappedResult,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getTrashByTags)
  public async getTrashByTags(request: GetTrashByTagsRequestDto): Promise<GetTrashByTagsResponse> {
    const { tags } = request;

    const result = await this.trashService.getByTags({ tags });

    const mappedResult = TrashMapper.mapFromRawArray(result);

    return {
      status: HttpStatus.OK,
      trash: mappedResult,
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

    const mappedResult = TrashMapper.mapFromRawArray(result);

    return {
      status: HttpStatus.OK,
      trash: mappedResult,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.createTrash)
  public async createTrash(request: CreateTrashRequest): Promise<CreateTrashResponse> {
    const { trash } = request;

    await this.trashService.create({
      trash: new TrashDraft({
        coordinates: trash.location,
        tag: trash.tag as TrashTagsEnum,
      }),
    });

    return {
      status: HttpStatus.CREATED,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.updateTrash)
  public async updateTrash(request: UpdateTrashRequest): Promise<UpdateTrashResponse> {
    const { trash } = request;

    await this.trashService.update({
      trash: new TrashUpdateDto({
        location: trash.location,
        tag: trash.tag as TrashTagsEnum,
        uuid: trash.uuid,
      }),
    });

    return {
      status: HttpStatus.OK,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.deleteTrash)
  public async deleteTrash(request: DeleteTrashRequest): Promise<DeleteTrashResponse> {
    const { uuid } = request;

    await this.trashService.delete(uuid);

    return {
      status: HttpStatus.OK,
    };
  }
}
