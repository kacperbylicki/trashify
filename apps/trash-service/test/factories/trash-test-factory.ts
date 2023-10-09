import { CoordinatesGenerator, ScalarGenerator, UtilityGenerator } from '@trashify/testing';
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
      uuid: ScalarGenerator.uuid(),
      createdAt: UtilityGenerator.pastDate().getTime(),
      updatedAt: UtilityGenerator.pastDate().getTime(),
      geolocation: {
        type: 'Point',
        coordinates: CoordinatesGenerator.coordinates({}),
      },
      tag: UtilityGenerator.enumMember(TrashTags) as TrashTagsEnum,
      ...input,
    };
  }
}
