import { Generator } from '@trashify/testing';
import { Trash } from '../../../entities/trash.entity';
import { TrashTags } from '../../../enums/trash-tags.enum';

export class TrashTestFactory {
  public create(): Trash {
    return {
      uuid: Generator.uuid(),
      createdAt: Generator.pastDate().getTime(),
      updatedAt: Generator.pastDate().getTime(),
      location: {
        type: 'Point',
        coordinates: Generator.coordinates({}),
      },
      tags: [Generator.enumMember(TrashTags)],
    };
  }
}
