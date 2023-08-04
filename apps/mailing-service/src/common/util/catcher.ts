/**
 *  A wrapper function to catch errors in async functions
 *
 * @param fn Any function to be repeated
 * @returns [return value of fn | null, error | null]
 */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function catcher<T extends () => Promise<Awaited<ReturnType<T>>>>(
  method: T,
): Promise<[Awaited<ReturnType<T>> | null, Error | null]> {
  try {
    //eslint-disable-next-line security/detect-object-injection
    const res = await method();
    return [res, null];
  } catch (error) {
    return [null, error as Error];
  }
}
