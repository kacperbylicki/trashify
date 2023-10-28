export const accountGrpcMethod = {
  "getAccount": "getAccount",
  "register": "register",
  "resendRegistrationConfirmationEmail": "resendRegistrationConfirmationEmail",
  "confirmRegistration": "confirmRegistration",
  "login": "login",
  "validateJwt": "validateJwt",
  "validateRefreshJwt": "validateRefreshJwt",
  "refreshToken": "refreshToken",
  "logout": "logout",
  "createResetPasswordToken": "createResetPasswordToken",
  "changePassword": "changePassword",
  "changeUsername": "changeUsername",
  "changeEmail": "changeEmail",
  "confirmNewEmail": "confirmNewEmail"
} as const;

export type accountGrpcMethodEnum = keyof typeof accountGrpcMethod;
