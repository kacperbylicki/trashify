export const accountGrpcMethod = {
  getAccount: 'getAccount',
  register: 'register',
  login: 'login',
  validateJwt: 'validateJwt',
  validateRefreshJwt: 'validateRefreshJwt',
  refreshToken: 'refreshToken',
  logout: 'logout',
  createResetPasswordToken: 'createResetPasswordToken',
  changePassword: 'changePassword',
  changeUsername: 'changeUsername',
  changeEmail: 'changeEmail',
} as const;

export type accountGrpcMethodEnum = keyof typeof accountGrpcMethod;
