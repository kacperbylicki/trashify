/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const accountProtobufPackage = 'account';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Account {
  uuid: string;
  email: string;
  username: string;
}

export interface GetAccountRequest {
  accountId: string;
}

export interface GetAccountResponse {
  status: number;
  error?: string[];
  data?: Account | null;
}

/** Register */
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  status: number;
  error?: string[];
}

/** Login */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error?: string[];
  data?: Tokens | null;
}

/** Validate Access JWT */
export interface ValidateJwtRequest {
  accessToken: string;
}

export interface ValidateJwtResponse {
  status: number;
  error?: string[];
  data?: ValidateJwtResponse_ValidateJwtData | null;
}

export interface ValidateJwtResponse_ValidateJwtData {
  isValid: boolean;
  accountId: string;
}

/** Validate Refresh JWT */
export interface ValidateRefreshJwtRequest {
  refreshToken: string;
}

export interface ValidateRefreshJwtResponse {
  status: number;
  error?: string[];
  data?: ValidateRefreshJwtResponse_ValidateRefreshJwtData | null;
}

export interface ValidateRefreshJwtResponse_ValidateRefreshJwtData {
  isValid: boolean;
  accountId: string;
}

/** RefreshToken */
export interface RefreshTokenRequest {
  accountId: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: number;
  error?: string[];
  data?: Tokens | null;
}

/** Logout */
export interface LogoutRequest {
  accountId: string;
}

export interface LogoutResponse {
  status: number;
  error?: string[];
}

export const ACCOUNT_PACKAGE_NAME = 'account';

export abstract class AccountServiceClient {
  abstract getAccount(
    request: GetAccountRequest,
  ): Observable<GetAccountResponse>;
  abstract register(request: RegisterRequest): Observable<RegisterResponse>;
  abstract login(request: LoginRequest): Observable<LoginResponse>;
  abstract validateJwt(
    request: ValidateJwtRequest,
  ): Observable<ValidateJwtResponse>;
  abstract validateRefreshJwt(
    request: ValidateRefreshJwtRequest,
  ): Observable<ValidateRefreshJwtResponse>;
  abstract refreshToken(
    request: RefreshTokenRequest,
  ): Observable<RefreshTokenResponse>;
  abstract logout(request: LogoutRequest): Observable<LogoutResponse>;
}

export interface AccountServiceController {
  getAccount(
    request: GetAccountRequest,
  ):
    | Promise<GetAccountResponse>
    | Observable<GetAccountResponse>
    | GetAccountResponse;

  register(
    request: RegisterRequest,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse;

  login(
    request: LoginRequest,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  validateJwt(
    request: ValidateJwtRequest,
  ):
    | Promise<ValidateJwtResponse>
    | Observable<ValidateJwtResponse>
    | ValidateJwtResponse;

  validateRefreshJwt(
    request: ValidateRefreshJwtRequest,
  ):
    | Promise<ValidateRefreshJwtResponse>
    | Observable<ValidateRefreshJwtResponse>
    | ValidateRefreshJwtResponse;

  refreshToken(
    request: RefreshTokenRequest,
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse;

  logout(
    request: LogoutRequest,
  ): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getAccount',
      'register',
      'login',
      'validateJwt',
      'validateRefreshJwt',
      'refreshToken',
      'logout',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AccountService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('AccountService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const ACCOUNT_SERVICE_NAME = 'AccountService';
