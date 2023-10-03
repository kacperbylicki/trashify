import { Controller, HttpStatus } from '@nestjs/common';
import { CreateTrashRequestDto } from '../dtos/create-trash.dto';
import {
  CreateTrashResponse,
  DeleteTrashResponse,
  GetAllTrashResponse,
  GetTrashByTagsResponse,
  GetTrashInDistanceResponse,
  TRASH_SERVICE_NAME,
  TrashServiceController,
  UpdateTrashResponse,
  trashGrpcMethods,
} from '@trashify/transport';
import { DeleteTrashRequestDto } from '../dtos/delete-trash.dto';
import { GetTrashByTagsRequestDto, GetTrashInDistanceRequestDto, TrashUpdateDto } from '../dtos';
import { GrpcMethod } from '@nestjs/microservices';
import { TrashDraft } from '../dtos/trash.draft';
import { TrashMapper } from '../mappers/trash-mapper';
import { TrashService } from '../services';
import { TrashTagsEnum } from '../enums/trash-tags.enum';
import { UpdateTrashRequestDto } from '../dtos/update-trash.dto';

@Controller()
export class TrashController implements TrashServiceController {
  public constructor(private readonly trashService: TrashService) {}
  @GrpcMethod(TRASH_SERVICE_NAME, trashGrpcMethods.getAllTrash)
  public async getAllTrash(): Promise<GetAllTrashResponse> {
    const result = await this.trashService.getAll();

    const mappedResult = TrashMapper.mapFromRawArray(result);

    return {
      status: HttpStatus.OK,
      trash: mappedResult,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, trashGrpcMethods.getTrashByTags)
  public async getTrashByTags(request: GetTrashByTagsRequestDto): Promise<GetTrashByTagsResponse> {
    const { tags } = request;

    const result = await this.trashService.getByTags({ tags });

    const mappedResult = TrashMapper.mapFromRawArray(result);

    return {
      status: HttpStatus.OK,
      trash: mappedResult,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, trashGrpcMethods.getTrashInDistance)
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

  @GrpcMethod(TRASH_SERVICE_NAME, trashGrpcMethods.createTrash)
  public async createTrash(request: CreateTrashRequestDto): Promise<CreateTrashResponse> {
    const { trash } = request;

    await this.trashService.create({
      trash: new TrashDraft({
        geolocation: trash.geolocation,
        tag: trash.tag as TrashTagsEnum,
      }),
    });

    return {
      status: HttpStatus.CREATED,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, trashGrpcMethods.updateTrash)
  public async updateTrash(request: UpdateTrashRequestDto): Promise<UpdateTrashResponse> {
    const { trash } = request;

    await this.trashService.update({
      trash: new TrashUpdateDto({
        geolocation: trash.geolocation,
        tag: trash.tag as TrashTagsEnum,
        uuid: trash.uuid,
      }),
    });

    return {
      status: HttpStatus.OK,
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, trashGrpcMethods.deleteTrash)
  public async deleteTrash(request: DeleteTrashRequestDto): Promise<DeleteTrashResponse> {
    const { uuid } = request;

    await this.trashService.delete(uuid);

    return {
      status: HttpStatus.OK,
    };
  }
}
