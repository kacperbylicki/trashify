import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Trash } from '../entities/trash.entity';
import { TrashTagsEnum } from '../enums/trash-tags.enum';

interface FindByTagsPayload {
  tags: TrashTagsEnum[];
}

interface FindInDistancePayload {
  coordinates: [number, number];
  minDistance: number;
  maxDistance: number;
}

@Injectable()
export class TrashRepository {
  constructor(@InjectModel('Trash') private readonly trashModel: Model<Trash>) {}

  async findAll(): Promise<Trash[]> {
    return await this.trashModel.find({}).lean();
  }

  async findByTags(payload: FindByTagsPayload): Promise<Trash[]> {
    const { tags } = payload;

    const result = await this.trashModel
      .find({
        tags: {
          $in: [tags],
        },
      })
      .lean();

    return result;
  }

  async findInDistance(payload: FindInDistancePayload): Promise<Trash[]> {
    const { coordinates, minDistance, maxDistance } = payload;

    const result = await this.trashModel
      .find({
        location: {
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
}
