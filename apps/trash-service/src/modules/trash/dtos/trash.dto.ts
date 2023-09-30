import { TrashTagsEnum } from '../enums/trash-tags.enum';

interface TrashDtoState {
  readonly uuid: string;
  readonly location: [number, number];
  readonly tag: TrashTagsEnum;
}

export class TrashDto {
  public readonly uuid!: string;
  public readonly location!: [number, number];
  public readonly tag!: TrashTagsEnum;

  public constructor(state: TrashDtoState) {
    this.location = state.location;

    this.tag = state.tag;

    this.uuid = state.uuid;
  }
}

interface TrashUpdateState {
  readonly uuid: string;
  readonly location?: [number, number];
  readonly tag?: TrashTagsEnum;
}

export class TrashUpdateDto {
  public readonly uuid!: string;
  public readonly location?: [number, number];
  public readonly tag?: TrashTagsEnum;

  public constructor(state: TrashUpdateState) {
    this.location = state.location;

    this.tag = state.tag;

    this.uuid = state.uuid;
  }
}
