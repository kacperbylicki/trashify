import { Controller } from '@nestjs/common';
import {
  GetAllTrashResponse,
  GetTrashByTagsRequest,
  GetTrashByTagsResponse,
  GetTrashInDistanceResponse,
  TRASH_SERVICE_NAME,
  TrashServiceController,
} from '@trashify/transport';
import { GrpcMethod } from '@nestjs/microservices';
import { TrashService } from '../services';
import { grpcMethods } from '../enums/grpc-methods.enum';

@Controller()
export class TrashController implements TrashServiceController {
  constructor(private readonly trashService: TrashService) {}

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getAllTrash)
  getAllTrash(): GetAllTrashResponse {
    return {
      ok: true,
      trash: this.trashService.getAll(),
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getTrashByTags)
  getTrashByTags(request: GetTrashByTagsRequest): GetTrashByTagsResponse {
    const { tags } = request;

    return {
      ok: true,
      trash: this.trashService.getByTags({ tags }),
    };
  }

  @GrpcMethod(TRASH_SERVICE_NAME, grpcMethods.getTrashInDistance)
  getTrashInDistance(): GetTrashInDistanceResponse {
    return {
      ok: true,
      trash: this.trashService.getInDistance(),
    };
  }
}
