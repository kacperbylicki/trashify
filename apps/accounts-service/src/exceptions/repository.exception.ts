type RepositoryErrorContext = {
  operation: 'find' | 'delete' | 'save';
  entityName: string;
} & Record<string, string>;

// TODO: Move to a common package

export class RepositoryError extends Error {
  public readonly context: RepositoryErrorContext;

  public readonly originalError?: Error;

  public constructor(context: RepositoryErrorContext, originalError?: Error) {
    super('Repository error.');

    this.context = context;

    this.originalError = originalError;
  }
}
