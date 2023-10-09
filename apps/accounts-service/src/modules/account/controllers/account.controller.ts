import {
  ACCOUNT_SERVICE_NAME,
  GetAccountResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  ValidateJwtResponse,
  ValidateRefreshJwtResponse,
  accountGrpcMethod,
} from '@trashify/transport';
import { AccountService, AuthService } from '../services';
import { Controller } from '@nestjs/common';
import {
  GetAccountRequestDto,
  LoginRequestDto,
  LogoutRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ValidateJwtRequestDto,
  ValidateRefreshJwtRequestDto,
} from '../dtos';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.getAccount)
  getAccount(payload: GetAccountRequestDto): Promise<GetAccountResponse> {
    return this.accountService.getCurrentAccount(payload.accountId);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.login)
  login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.accountService.login(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.register)
  register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.accountService.register(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.validateJwt)
  validateJwt(payload: ValidateJwtRequestDto): Promise<ValidateJwtResponse> {
    return this.authService.validateJwt(payload.accessToken);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.validateRefreshJwt)
  validateRefreshJwt(payload: ValidateRefreshJwtRequestDto): Promise<ValidateRefreshJwtResponse> {
    return this.authService.validateRefreshJwt(payload.refreshToken);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.refreshToken)
  refreshToken(payload: RefreshTokenRequestDto): Promise<RefreshTokenResponse> {
    return this.accountService.refreshToken(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.logout)
  logout(payload: LogoutRequestDto): Promise<LogoutResponse> {
    return this.accountService.logout(payload.accountId);
  }
}
