export class PollerNotStartedException extends Error {
  constructor(public details?: NonNullable<unknown>) {
    const message = details ?? 'Poller has not been started';

    if (typeof message === 'string') {
      super(message);
      return;
    }

    super(JSON.stringify(message));
  }
}
