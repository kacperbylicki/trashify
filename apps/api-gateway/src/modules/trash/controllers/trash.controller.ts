import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  GetAllTrashResponseDto,
  GetTrashByTagsRequestDto,
  GetTrashByTagsResponseDto,
  GetTrashInDistanceQueryParamsDto,
  GetTrashInDistanceResponseDto,
} from './dtos';
import { HttpStatusInterceptor, JwtAuthGuard, TimeoutInterceptor } from '../../../common';
import { Observable } from 'rxjs';
import { TrashServiceClient } from '@trashify/transport';

@Controller('trash')
@ApiTags('TrashController')
@UseInterceptors(TimeoutInterceptor, HttpStatusInterceptor)
export class TrashController {
  public constructor(private readonly client: TrashServiceClient) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetAllTrashResponseDto,
  })
  @Get()
  async getAll(): Promise<Observable<GetAllTrashResponseDto>> {
    return this.client.getAllTrash({});
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({
    type: GetTrashByTagsRequestDto,
  })
  @ApiOkResponse({
    type: GetTrashByTagsResponseDto,
  })
  @Get('tags')
  async getByTags(
    @Body() request: GetTrashByTagsRequestDto,
  ): Promise<Observable<GetTrashByTagsResponseDto>> {
    return this.client.getTrashByTags(request);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetTrashInDistanceResponseDto,
  })
  @Get('distance')
  async getByDistance(
    @Query() queryParams: GetTrashInDistanceQueryParamsDto,
  ): Promise<Observable<GetTrashInDistanceResponseDto>> {
    const { latitude, longitude, maxDistance, minDistance } = queryParams;

    return this.client.getTrashInDistance({
      latitude,
      longitude,
      maxDistance,
      minDistance,
    });
  }
}
