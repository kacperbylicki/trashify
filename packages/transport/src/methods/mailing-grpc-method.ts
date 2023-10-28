export const mailingGrpcMethod = {
  "sendEmail": "sendEmail"
} as const;

export type mailingGrpcMethodEnum = keyof typeof mailingGrpcMethod;
