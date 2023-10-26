export const accountGrpcMethod = {
  "getAccount": "getAccount",
  "register": "register",
  "login": "login",
  "validateJwt": "validateJwt",
  "validateRefreshJwt": "validateRefreshJwt",
  "refreshToken": "refreshToken",
  "logout": "logout"
} as const;

export type accountGrpcMethodEnum = keyof typeof accountGrpcMethod;
