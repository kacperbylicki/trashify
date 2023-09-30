import { Generator } from '@trashify/testing';
import { Trash } from '../../../entities/trash.entity';
import { TrashTags, TrashTagsEnum } from '../../../enums/trash-tags.enum';

export type RawTrash = Omit<Trash, 'location'> & {
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
};

export class TrashTestFactory {
  public create(input?: Partial<RawTrash>): RawTrash {
    return {
      uuid: Generator.uuid(),
      createdAt: Generator.pastDate().getTime(),
      updatedAt: Generator.pastDate().getTime(),
      location: {
        type: 'Point',
        coordinates: Generator.coordinates({}),
      },
      tag: Generator.enumMember(TrashTags) as TrashTagsEnum,
      ...input,
    };
  }
}
