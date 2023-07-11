export class PollerNotStartedException extends Error {
  constructor(public details: any) {
    super('Poller has not been started');
  }
}
