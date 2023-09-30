import { Injectable } from '@nestjs/common';
import { Trash } from '../entities/trash.entity';
import { TrashDraft } from '../dtos/trash.draft';
import { TrashRepository } from '../repository/trash.repository';
import { TrashTagsEnum } from '../enums/trash-tags.enum';
import { TrashUpdateDto } from '../dtos';

interface GetByTagsPayload {
  tags: TrashTagsEnum[];
}

interface GetInDistancePayload {
  coordinates: [number, number];
  minDistance?: number;
  maxDistance?: number;
}

interface UpdatePayload {
  trash: TrashUpdateDto;
}

interface CreatePayload {
  trash: TrashDraft;
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

  public async create(payload: CreatePayload): Promise<Trash> {
    return await this.trashRepository.save(payload);
  }

  public async update(payload: UpdatePayload): Promise<Trash> {
    return await this.trashRepository.save(payload);
  }

  public async delete(uuid: string): Promise<void> {
    await this.trashRepository.delete(uuid);
  }
}
