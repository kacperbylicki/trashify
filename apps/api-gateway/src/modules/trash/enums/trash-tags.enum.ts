export const TrashTags = {
  batteries: 'batteries',
  bio: 'bio',
  bottleMachine: 'bottleMachine',
  mixed: 'mixed',
  municipal: 'municipal',
  paper: 'paper',
  petFeces: 'petFeces',
  plastic: 'plastic',
  toners: 'toners',
  glass: 'glass',
} as const;

export type TrashTagsEnum = keyof typeof TrashTags;
