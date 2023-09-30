import { Trash } from '../entities/trash.entity';
import { TrashDto } from '../dtos';

export class TrashMapper {
  public static mapFromRaw(raw: Trash): TrashDto {
    return {
      location: raw.location,
      tag: raw.tag,
      uuid: raw.uuid,
    };
  }

  public static mapFromRawArray(raw: Trash[]): TrashDto[] {
    return raw.map((r) => this.mapFromRaw(r));
  }
}
