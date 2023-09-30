import { faker } from '@faker-js/faker';

interface IntegerGenerationOptions {
  max: Integer;
  /**
   * @default 0
   */
  min?: Integer;
}

interface FloatGenerationOptions {
  max: number;
  /**
   * @default 0
   */
  min?: number;
  /**
   * Maximum amount of decimal points.
   *
   * @default 2
   */
  precision?: number;
}

interface GeolocationGenerationOptions {
  max?: number;
  min?: number;
  precision?: number;
}

interface CoordinatesGenerationOptions {
  latitudeOptions?: GeolocationGenerationOptions;
  longitudeOptions?: GeolocationGenerationOptions;
}

type Integer = number;

export class Generator {
  public static uuid(): string {
    return faker.string.uuid();
  }

  /**
   * Generates a tuple of two numbers. \
   * These numbers are longitude and latitude in this order.
   *
   * @returns {[number, number]}
   */
  public static coordinates(options: CoordinatesGenerationOptions): [number, number] {
    const { latitudeOptions = {}, longitudeOptions = {} } = options;

    const longitude = this.longitude(longitudeOptions);

    const latitude = this.latitude(latitudeOptions);

    return [longitude, latitude];
  }

  public static longitude(options: GeolocationGenerationOptions): number {
    const { max, min, precision } = options;

    return faker.location.longitude({
      max,
      min,
      precision,
    });
  }

  public static latitude(options: GeolocationGenerationOptions): number {
    const { max, min, precision } = options;

    return faker.location.latitude({
      max,
      min,
      precision,
    });
  }

  public static pastDate(): Date {
    const date = faker.date.past();

    return date;
  }

  public static integer(options: IntegerGenerationOptions): Integer {
    const { max, min = 0 } = options;

    return faker.number.int({
      max,
      min,
    });
  }

  public static float(options: FloatGenerationOptions): number {
    const { max, min = 0, precision = 2 } = options;

    return faker.number.float({
      max,
      min,
      precision,
    });
  }

  public static enumMember(enumObject: Record<string, string>): string {
    const enumValues = Object.values(enumObject);

    const enumValuesAmount = enumValues.length;

    return enumValues[this.integer({ max: enumValuesAmount - 1 })];
  }

  public static email(): string {
    return faker.internet.email();
  }

  public static username(): string {
    return faker.internet.userName();
  }

  public static password(length: number): string {
    return faker.internet.password({
      length,
    });
  }
}
