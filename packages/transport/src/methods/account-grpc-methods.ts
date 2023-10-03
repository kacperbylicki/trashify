export const accountGrpcMethods = {
  getAccount: 'getAccount',
  register: 'register',
  login: 'login',
  validateJwt: 'validateJwt',
  validateRefreshJwt: 'validateRefreshJwt',
  refreshToken: 'refreshToken',
  logout: 'logout',
} as const;

export type accountGrpcMethodsEnum = keyof typeof accountGrpcMethods;
