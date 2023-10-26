/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateTrashPayloadDto,
  CreateTrashRequestDto,
} from '../../src/modules/trash/dtos/create-trash.dto';
import { validate } from 'class-validator';

describe('CreateTrashPayloadDto', () => {
  it('throws an error - when given an invalid tag', async () => {
    const testObject = new CreateTrashPayloadDto();

    testObject.geolocation = [5.55, 5.55];

    testObject.tag = 'invalid' as any;

    const errors = await validate(testObject);

    expect(errors).toHaveLength(1);

    expect(errors[0].property === 'tag').toBeTruthy();

    expect(errors[0].constraints?.isEnum).toBeTruthy();
  });

  it('throws an error - given only one array element', async () => {
    const testObject = new CreateTrashPayloadDto();

    testObject.geolocation = [5.55] as any;

    testObject.tag = 'batteries';

    const validationResult = await validate(testObject);

    expect(validationResult).toMatchObject([
      {
        property: 'geolocation',
        constraints: {
          arrayMinSize: expect.any(String),
        },
      },
    ]);
  });

  it('throws an error - given more than two array elements', async () => {
    const testObject = new CreateTrashPayloadDto();

    testObject.geolocation = [5.55, 5.55, 5.55] as any;

    testObject.tag = 'batteries';

    const validationResult = await validate(testObject);

    expect(validationResult).toMatchObject([
      {
        property: 'geolocation',
        constraints: {
          arrayMaxSize: expect.any(String),
        },
      },
    ]);
  });

  it('throws an error - given an empty array', async () => {
    const testObject3 = new CreateTrashPayloadDto();

    testObject3.geolocation = [] as any;

    testObject3.tag = 'batteries';

    const validationResult = await validate(testObject3);

    expect(validationResult).toMatchObject([
      {
        property: 'geolocation',
        constraints: {
          arrayMinSize: expect.any(String),
        },
      },
    ]);
  });

  it('throws an error - given invalid array value', async () => {
    const testObject = new CreateTrashPayloadDto();

    testObject.geolocation = [5.55, 'invalid'] as any;

    testObject.tag = 'batteries';

    const result = await validate(testObject);

    expect(result).toHaveLength(1);

    expect(result[0]?.constraints?.isNumber).toBeTruthy();
  });
});

describe('CreateTrashRequestDto', () => {
  it('throws an error - given no payload', async () => {
    const testObject = new CreateTrashRequestDto();

    const result = await validate(testObject);

    expect(result).toHaveLength(1);

    expect(result[0].property === 'trash').toBeTruthy();

    expect(result[0].constraints?.isNotEmpty).toBeTruthy();
  });
});
