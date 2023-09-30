import { TrashTagsEnum } from '../enums/trash-tags.enum';

interface TrashDraftState {
  readonly tag: TrashTagsEnum;
  readonly coordinates: [number, number];
}

export class TrashDraft {
  public readonly tag: TrashTagsEnum;

  public readonly location: [number, number];

  public constructor(state: TrashDraftState) {
    this.tag = state.tag;

    this.location = state.coordinates;
  }
}
