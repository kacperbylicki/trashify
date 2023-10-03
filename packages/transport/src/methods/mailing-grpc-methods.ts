export const mailingGrpcMethods = {
  sendEmail: 'sendEmail',
} as const;

export type mailingGrpcMethodsEnum = keyof typeof mailingGrpcMethods;
