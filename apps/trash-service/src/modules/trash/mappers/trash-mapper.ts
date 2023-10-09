import { TrashDto } from '../dtos';
import { TrashRawEntity } from '../entities/trash.entity';

export class TrashMapper {
  public static mapFromRaw(raw: TrashRawEntity): TrashDto {
    return {
      geolocation: raw.geolocation.coordinates,
      tag: raw.tag,
      uuid: raw.uuid,
    };
  }

  public static mapFromRawArray(raw: TrashRawEntity[]): TrashDto[] {
    return raw.map((r) => this.mapFromRaw(r));
  }
}
