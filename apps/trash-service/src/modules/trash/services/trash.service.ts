import { Injectable } from '@nestjs/common';
import { Trash } from '../entities/trash.entity';
import { TrashRepository } from '../repository/trash.repository';
import { TrashTagsEnum } from '../enums/trash-tags.enum';

interface GetByTagsPayload {
  tags: TrashTagsEnum[];
}

interface GetInDistancePayload {
  coordinates: [number, number];
  minDistance?: number;
  maxDistance?: number;
}

@Injectable()
export class TrashService {
  constructor(private readonly trashRepository: TrashRepository) {}

  public async getAll(): Promise<Trash[]> {
    return await this.trashRepository.findAll();
  }

  public async getByTags(payload: GetByTagsPayload): Promise<Trash[]> {
    const { tags } = payload;

    const result = await this.trashRepository.findByTags({
      tags,
    });

    return result;
  }

  public async getInDistance(payload: GetInDistancePayload): Promise<Trash[]> {
    const { coordinates, maxDistance = 5, minDistance = 1500 } = payload;

    const result = await this.trashRepository.findInDistance({
      coordinates,
      minDistance,
      maxDistance,
    });

    return result;
  }
}
