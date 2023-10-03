import { Injectable } from '@nestjs/common';
import { TrashDraft } from '../dtos/trash.draft';
import { TrashDto, TrashUpdateDto } from '../dtos';
import { TrashRawEntity } from '../entities/trash.entity';
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

interface UpdatePayload {
  trash: TrashUpdateDto;
}

interface CreatePayload {
  trash: TrashDraft;
}

@Injectable()
export class TrashService {
  constructor(private readonly trashRepository: TrashRepository) {}

  public async getAll(): Promise<TrashRawEntity[]> {
    return await this.trashRepository.findAll();
  }

  public async getByTags(payload: GetByTagsPayload): Promise<TrashRawEntity[]> {
    const { tags } = payload;

    const result = await this.trashRepository.findByTags({
      tags,
    });

    return result;
  }

  public async getInDistance(payload: GetInDistancePayload): Promise<TrashRawEntity[]> {
    const { coordinates, maxDistance = 5, minDistance = 1500 } = payload;

    const result = await this.trashRepository.findInDistance({
      coordinates,
      minDistance,
      maxDistance,
    });

    return result;
  }

  public async create(payload: CreatePayload): Promise<TrashDto> {
    return await this.trashRepository.save(payload);
  }

  public async update(payload: UpdatePayload): Promise<TrashDto> {
    return await this.trashRepository.save(payload);
  }

  public async delete(uuid: string): Promise<void> {
    await this.trashRepository.delete(uuid);
  }
}
