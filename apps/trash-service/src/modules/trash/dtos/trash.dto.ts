import { Trash } from '@trashify/transport';

export class TrashDto implements Trash {
  uuid!: string;
  location!: number[];
  tags!: string[];
}
