import { Injectable } from '@nestjs/common';
import { Trash } from '@trashify/transport';

interface GetByTagsPayload {
  tags: string[];
}

const availableTags = {
  communal: 'communal',
  paper: 'paper',
  glass: 'glass',
  plastic: 'plastic',
  batteries: 'batteries',
  petFeces: 'petFeces',
  mixed: 'mixed',
};

const someTrash: Array<Trash> = [
  {
    id: 'd656a158-d600-4b09-a927-825c4eedbd79',
    latitude: 52.406389,
    longitude: 16.891389,
    tags: [availableTags.communal, availableTags.mixed],
  },
  {
    id: 'd656a158-d600-4b09-a927-825c4eedbd79',
    latitude: -15.1636,
    longitude: 74.8948,
    tags: ['communal'],
  },
  {
    id: '15030226-9b17-4f06-b491-70a519442976',
    latitude: -26.5536,
    longitude: 64.9191,
    tags: ['communal'],
  },
  {
    id: '980c3e4b-0491-4fc4-a4da-70e3e179e8b8',
    latitude: -12.7622,
    longitude: -32.3489,
    tags: ['plastic'],
  },
  {
    id: 'bf4dbaa6-64e5-4dfd-b3e2-097e3dd6087e',
    latitude: -78.2724,
    longitude: 43.2663,
    tags: ['communal'],
  },
  {
    id: '45a49e23-75f9-4f9a-8ad4-adc20c00d4d2',
    latitude: -16.2452,
    longitude: 43.9624,
    tags: ['paper'],
  },
  {
    id: '2b4bc2db-e4d9-472f-920f-252cfad8b85b',
    latitude: -31.7742,
    longitude: -84.0306,
    tags: ['petFeces'],
  },
  {
    id: 'cab87e4f-5f58-450d-ace6-206cd3cbec6b',
    latitude: 71.5711,
    longitude: 23.5223,
    tags: ['plastic'],
  },
  {
    id: '7f1447d8-00f0-4a38-91c8-089e393f6fd1',
    latitude: 34.7004,
    longitude: -63.2641,
    tags: ['plastic'],
  },
  {
    id: '4ebda0e6-a1f4-4c5c-8c5a-5553b369e8cb',
    latitude: -35.4024,
    longitude: -66.6973,
    tags: ['batteries'],
  },
  {
    id: 'ac9baf61-df75-43aa-a1a6-3b4203c21d58',
    latitude: 78.2465,
    longitude: -163.3261,
    tags: ['batteries'],
  },
  {
    id: '781ddefb-c171-4f95-bc3a-b0db7812ec24',
    latitude: -74.3131,
    longitude: -154.0098,
    tags: ['petFeces'],
  },
  {
    id: 'b03952a9-252c-44b8-9d13-43666a039aa5',
    latitude: 58.734,
    longitude: 96.0679,
    tags: ['batteries'],
  },
  {
    id: '606f48c5-de24-48e8-9d4b-071d81fe0ffe',
    latitude: -78.0863,
    longitude: 67.1501,
    tags: ['glass'],
  },
  {
    id: 'ec871a34-2cd4-45cd-8a6f-b8dabc62560f',
    latitude: -72.2517,
    longitude: 36.4732,
    tags: ['glass'],
  },
  {
    id: '4c989aa1-d7bf-4f99-8528-b28eb1bc4efe',
    latitude: -67.34,
    longitude: 47.1533,
    tags: ['communal'],
  },
  {
    id: 'bb1599b2-f350-4673-b307-e53c2986e42f',
    latitude: 84.3106,
    longitude: -93.0469,
    tags: ['communal'],
  },
  {
    id: '555a1681-8843-47c4-899f-ec217b754ecc',
    latitude: -64.042,
    longitude: -100.7667,
    tags: ['petFeces'],
  },
  {
    id: 'b05f2576-7ed1-4fbc-86cf-0543c68df1bc',
    latitude: 57.9809,
    longitude: 148.4805,
    tags: ['glass'],
  },
  {
    id: '085c7eea-2862-4a5f-a336-23e7e04b8f4f',
    latitude: -41.1286,
    longitude: -159.6851,
    tags: ['petFeces'],
  },
  {
    id: 'eaadbf0b-b39b-4479-98b6-8c9b345c784e',
    latitude: 53.1629,
    longitude: 99.6212,
    tags: ['communal'],
  },
  {
    id: '822865ee-0cac-4755-852d-0bac8944f310',
    latitude: 2.715,
    longitude: 132.8999,
    tags: ['communal'],
  },
];

@Injectable()
export class TrashService {
  private readonly trashArray: Array<Trash> = someTrash;

  public getAll(): Trash[] {
    return this.trashArray;
  }

  public getByTags(payload: GetByTagsPayload): Trash[] {
    const { tags } = payload;

    const trash = this.trashArray.filter((trash) => trash.tags.filter((el) => tags.includes(el)));

    return trash;
  }

  public getInDistance(): Trash[] {
    return this.trashArray;
  }
}
