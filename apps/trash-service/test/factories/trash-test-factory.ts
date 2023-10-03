import { Generator } from '@trashify/testing';
import { TrashRawEntity } from '../../src/modules/trash/entities/trash.entity';
import { TrashTags, TrashTagsEnum } from '../../src/modules/trash/enums/trash-tags.enum';

export type RawTrash = Omit<TrashRawEntity, 'location'> & {
  geolocation: {
    type: 'Point';
    coordinates: [number, number];
  };
};

export class TrashTestFactory {
  public create(input?: Partial<RawTrash>): TrashRawEntity {
    return {
      uuid: Generator.uuid(),
      createdAt: Generator.pastDate().getTime(),
      updatedAt: Generator.pastDate().getTime(),
      geolocation: {
        type: 'Point',
        coordinates: Generator.coordinates({}),
      },
      tag: Generator.enumMember(TrashTags) as TrashTagsEnum,
      ...input,
    };
  }
}
