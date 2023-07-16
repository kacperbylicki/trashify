/**
 *  A wrapper function to catch errors in async functions
 *
 * @param fn Any function to be repeated
 * @returns [return value of fn | null, error | null]
 */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function catcher<T extends () => any>(
  method: T,
): Promise<[Awaited<ReturnType<ReturnType<T>>> | null, Error | null]> {
  try {
    //eslint-disable-next-line security/detect-object-injection
    const res = await method();
    return [res, null];
  } catch (error) {
    return [null, error as Error];
  }
}
