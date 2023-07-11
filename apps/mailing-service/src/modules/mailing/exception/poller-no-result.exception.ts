export class PoolerNoResultException extends Error {
  constructor(
    message = 'No result from pooler.\nPlease check the Azure logs for more information',
  ) {
    super(message);
  }
}
