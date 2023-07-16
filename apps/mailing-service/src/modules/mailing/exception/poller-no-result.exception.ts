export class PollerNoResultException extends Error {
  constructor(
    message = 'No result from poller.\nPlease check the Azure logs for more information',
  ) {
    super(message);
  }
}
