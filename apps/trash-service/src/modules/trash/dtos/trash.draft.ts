import { TrashTagsEnum } from '../enums/trash-tags.enum';

interface TrashDraftState {
  readonly tag: TrashTagsEnum;
  readonly geolocation: [number, number];
}

export class TrashDraft {
  public readonly tag: TrashTagsEnum;

  public readonly geolocation: [number, number];

  public constructor(state: TrashDraftState) {
    this.tag = state.tag;

    this.geolocation = state.geolocation;
  }
}
