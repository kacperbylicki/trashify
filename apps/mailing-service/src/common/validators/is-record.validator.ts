import { isObject } from 'class-validator';

export const isRecordValidator = {
  validate(value: unknown): boolean {
    if (!isObject(value)) return false;
    if (Object.keys(value).length === 0) return true;

    const keys = Object.keys(value);

    return keys.every((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj = value as any;
      if (typeof key !== 'string') return false;
      if (!Array.isArray(obj[key])) return false;
      if (!obj[key].every((val: unknown) => typeof val === 'string')) return false;

      return true;
    });
  },
};
