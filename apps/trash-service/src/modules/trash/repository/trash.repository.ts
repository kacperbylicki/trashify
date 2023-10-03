import dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RepositoryError } from '../../../common/exceptions/repository.exception';
import { TrashDraft } from '../dtos/trash.draft';
import { TrashDto, TrashUpdateDto } from '../dtos';
import { TrashRawEntity } from '../entities/trash.entity';
import { TrashTagsEnum } from '../enums/trash-tags.enum';
import { v4 as uuidv4 } from 'uuid';

interface FindByTagsPayload {
  tags: TrashTagsEnum[];
}

interface FindInDistancePayload {
  coordinates: [number, number];
  minDistance: number;
  maxDistance: number;
}

interface SavePayload {
  trash: TrashUpdateDto | TrashDraft | never;
}

@Injectable()
export class TrashRepository {
  constructor(
    @InjectModel(TrashRawEntity.name) private readonly trashModel: Model<TrashRawEntity>,
  ) {}

  public async findAll(): Promise<TrashRawEntity[]> {
    return await this.trashModel.find({}).lean();
  }

  public async findByTags(payload: FindByTagsPayload): Promise<TrashRawEntity[]> {
    const { tags } = payload;

    const result = await this.trashModel
      .find({
        tag: {
          $in: tags,
        },
      })
      .lean();

    return result;
  }

  public async findInDistance(payload: FindInDistancePayload): Promise<TrashRawEntity[]> {
    const { coordinates, minDistance, maxDistance } = payload;

    const result = await this.trashModel
      .find({
        geolocation: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $minDistance: minDistance,
            $maxDistance: maxDistance,
          },
        },
      })
      .lean();

    return result;
  }

  public async save(payload: SavePayload): Promise<TrashDto> {
    const { trash } = payload;

    if (trash instanceof TrashUpdateDto) {
      return await this.update(trash);
    } else if (trash instanceof TrashDraft) {
      return await this.create(trash);
    }

    throw new RepositoryError(
      {
        operation: 'save',
        entityName: 'Trash',
      },
      new Error('Invalid payload.'),
    );
  }

  public async delete(uuid: string): Promise<void> {
    try {
      await this.trashModel.deleteOne({
        uuid,
      });
    } catch (error) {
      throw new RepositoryError(
        {
          entityName: 'Trash',
          operation: 'delete',
        },
        error as Error,
      );
    }
  }

  private async update(trash: TrashUpdateDto): Promise<TrashDto> {
    const existingTrash = await this.trashModel
      .findOne({
        uuid: trash.uuid,
      })
      .lean();

    if (!existingTrash)
      throw new RepositoryError(
        {
          entityName: 'Trash',
          operation: 'save',
          uuid: trash.uuid,
          reason: 'Entity does not exist.',
        },
        new Error('Entity does not exist.'),
      );

    try {
      const payload = {
        ...trash,
        updatedAt: dayjs().unix(),
      };

      await this.trashModel.updateOne(
        {
          uuid: trash.uuid,
        },
        payload,
      );

      return {
        ...existingTrash,
        ...trash,
        geolocation: trash.geolocation ?? existingTrash.geolocation.coordinates,
      };
    } catch (error) {
      throw new RepositoryError(
        {
          entityName: 'Trash',
          operation: 'save',
        },
        error as Error,
      );
    }
  }

  private async create(trashDraft: TrashDraft): Promise<TrashDto> {
    try {
      const payload = {
        uuid: uuidv4(),
        createdAt: dayjs().unix(),
        geolocation: trashDraft.geolocation,
        tag: trashDraft.tag,
        updatedAt: dayjs().unix(),
      };

      await this.trashModel.create({
        ...payload,
        geolocation: {
          type: 'Point',
          coordinates: payload.geolocation,
        },
      });

      return payload;
    } catch (error) {
      throw new RepositoryError(
        {
          entityName: 'Trash',
          operation: 'save',
        },
        error as Error,
      );
    }
  }
}
