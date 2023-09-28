import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  GetAllTrashRequest,
  GetAllTrashResponse,
  GetTrashByTagsRequest,
  GetTrashByTagsResponse,
  GetTrashInDistanceResponse,
  TrashServiceClient,
} from '@trashify/transport';
import { HttpStatusInterceptor, JwtAuthGuard, TimeoutInterceptor } from '../../../common';
import { Observable } from 'rxjs';

@Controller('trash')
@ApiTags('TrashController')
@UseInterceptors(TimeoutInterceptor, HttpStatusInterceptor)
export class TrashController {
  public constructor(private readonly client: TrashServiceClient) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(request: GetAllTrashRequest): Promise<Observable<GetAllTrashResponse>> {
    return await this.client.getAllTrash(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tags')
  async getByTags(request: GetTrashByTagsRequest): Promise<GetTrashByTagsResponse> {
    return await this.client.getTrashByTags(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('distance/:distance')
  async getByDistance(@Param('distance') distance: number): Promise<GetTrashInDistanceResponse> {
    return await this.client.getTrashInDistance({
      distance,
    });
  }
}
