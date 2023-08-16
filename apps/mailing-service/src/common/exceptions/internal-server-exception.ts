interface InternalServiceExceptionPayload {
  source: string;
  message: string;
  method: string;
}

export class InternalServerException extends Error {
  method: string;
  source: string;

  constructor({ message, method, source }: InternalServiceExceptionPayload) {
    super(message);

    this.method = method;

    this.source = source;
  }
}
