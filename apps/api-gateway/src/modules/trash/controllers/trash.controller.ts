import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTrashRequestDto, CreateTrashResponseDto } from '../dtos/create-trash-request.dto';
import {
  GetAllTrashResponseDto,
  GetTrashByTagsResponseDto,
  GetTrashInDistanceQueryParamsDto,
  GetTrashInDistanceResponseDto,
} from '../dtos';
import { HttpStatusInterceptor, JwtAuthGuard, TimeoutInterceptor } from '../../../common';
import { Observable } from 'rxjs';
import { TrashServiceClient } from '@trashify/transport';
import { TrashTags, TrashTagsEnum } from '../enums/trash-tags.enum';
import { UpdateTrashRequestDto, UpdateTrashResponseDto } from '../dtos/update-trash.request.dto';

@Controller('trash')
@ApiTags('TrashController')
@UseInterceptors(TimeoutInterceptor, HttpStatusInterceptor)
export class TrashController {
  public constructor(private readonly client: TrashServiceClient) {}

  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    type: GetAllTrashResponseDto,
  })
  @ApiBearerAuth()
  @Get()
  private async getAll(): Promise<Observable<GetAllTrashResponseDto>> {
    return this.client.getAllTrash({});
  }

  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    type: GetTrashByTagsResponseDto,
  })
  @ApiQuery({
    enum: TrashTags,
    name: 'tags',
    isArray: true,
  })
  @ApiBearerAuth()
  @Get('tags/:tags')
  private async getByTags(
    @Query('tags') tags: TrashTagsEnum[],
  ): Promise<Observable<GetTrashByTagsResponseDto>> {
    return this.client.getTrashByTags({ tags });
  }

  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    type: GetTrashInDistanceResponseDto,
  })
  @ApiBearerAuth()
  @Get('distance')
  private async getByDistance(
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

  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiBody({
    type: CreateTrashRequestDto,
  })
  @ApiOkResponse({
    type: CreateTrashResponseDto,
  })
  @ApiBearerAuth()
  @Post()
  private async create(
    @Body() request: CreateTrashRequestDto,
  ): Promise<Observable<CreateTrashResponseDto>> {
    return this.client.createTrash({
      trash: request.trash,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    type: UpdateTrashResponseDto,
  })
  @ApiBearerAuth()
  @Patch(':uuid')
  private async update(
    @Param('uuid') uuid: string,
    @Body() request: UpdateTrashRequestDto,
  ): Promise<Observable<unknown>> {
    return this.client.updateTrash({
      trash: {
        ...request.trash,
        uuid,
      },
    });
  }
}
