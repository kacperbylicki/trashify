/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateTrashPayloadDto,
  CreateTrashRequestDto,
} from '../../src/modules/trash/dtos/create-trash.dto';
import { validate } from 'class-validator';

describe('CreateTrashPayloadDto', () => {
  it('throws an error - when given an invalid tag', async () => {
    const testObject = new CreateTrashPayloadDto();

    testObject.location = [5.55, 5.55];

    testObject.tag = 'invalid' as any;

    const errors = await validate(testObject);

    expect(errors).toHaveLength(1);

    expect(errors[0].property === 'tag').toBeTruthy();

    expect(errors[0].constraints?.isEnum).toBeTruthy();
  });

  it('throws an error - given invalid invalid array length', async () => {
    const testObject1 = new CreateTrashPayloadDto();

    testObject1.location = [5.55] as any;

    testObject1.tag = 'batteries';

    const testObject2 = new CreateTrashPayloadDto();

    testObject2.location = [5.55, 5.55, 5.55] as any;

    testObject2.tag = 'batteries';

    const testObject3 = new CreateTrashPayloadDto();

    testObject3.location = [] as any;

    testObject3.tag = 'batteries';

    const [validationResult1, validationResult2, validationResult3] = await Promise.all([
      validate(testObject1),
      validate(testObject2),
      validate(testObject3),
    ]);

    expect(validationResult1).toHaveLength(1);

    expect(validationResult2).toHaveLength(1);

    expect(validationResult3).toHaveLength(1);

    expect(validationResult1[0].property === 'location').toBeTruthy();

    expect(validationResult2[0].property === 'location').toBeTruthy();

    expect(validationResult3[0].property === 'location').toBeTruthy();

    expect(validationResult1[0].constraints?.arrayMinSize).toBeTruthy();

    expect(validationResult2[0].constraints?.arrayMaxSize).toBeTruthy();

    expect(validationResult3[0].constraints?.arrayMinSize).toBeTruthy();
  });

  it('throws an error - given invalid array value', async () => {
    const testObject = new CreateTrashPayloadDto();

    testObject.location = [5.55, 'invalid'] as any;

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
