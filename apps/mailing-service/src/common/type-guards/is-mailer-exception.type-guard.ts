import { ErrorDetail } from '@azure/communication-email';

export const isMailerExceptionTypeGuard = (exception: unknown): exception is ErrorDetail => {
  // If is not an object or is an array or is null
  if (typeof exception !== 'object' || Array.isArray(exception) || exception === null) {
    return false;
  }

  const keys = Object.keys(exception);
  const searchedKeys = ['code', 'message', 'details'] as Array<keyof ErrorDetail> as string[];

  if (keys.every((el) => searchedKeys.includes(el))) {
    return true;
  }

  return false;
};
