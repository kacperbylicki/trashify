import {
  ACCOUNT_SERVICE_NAME,
  ChangeEmailResponse,
  ChangePasswordResponse,
  ChangeUsernameResponse,
  ConfirmNewEmailRequest,
  ConfirmNewEmailResponse,
  ConfirmRegistrationRequest,
  ConfirmRegistrationResponse,
  CreateResetPasswordTokenResponse,
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
import {
  ChangeEmailRequestDto,
  ChangePasswordRequestDto,
  ChangeUsernameRequestDto,
  CreateResetPasswordTokenRequestDto,
  GetAccountRequestDto,
  LoginRequestDto,
  LogoutRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ValidateJwtRequestDto,
  ValidateRefreshJwtRequestDto,
} from '../dtos';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.getAccount)
  public getAccount(payload: GetAccountRequestDto): Promise<GetAccountResponse> {
    return this.accountService.getCurrentAccount(payload.accountId);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.login)
  public login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.accountService.login(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.register)
  public register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.accountService.register(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.confirmRegistration)
  public confirmRegistration(
    payload: ConfirmRegistrationRequest,
  ): Promise<ConfirmRegistrationResponse> {
    return this.accountService.confirmRegistration(payload.uuid);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.validateJwt)
  public validateJwt(payload: ValidateJwtRequestDto): Promise<ValidateJwtResponse> {
    return this.authService.validateJwt(payload.accessToken);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.validateRefreshJwt)
  public validateRefreshJwt(
    payload: ValidateRefreshJwtRequestDto,
  ): Promise<ValidateRefreshJwtResponse> {
    return this.authService.validateRefreshJwt(payload.refreshToken);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.refreshToken)
  public refreshToken(payload: RefreshTokenRequestDto): Promise<RefreshTokenResponse> {
    return this.accountService.refreshToken(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.logout)
  public logout(payload: LogoutRequestDto): Promise<LogoutResponse> {
    return this.accountService.logout(payload.accountId);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.changeEmail)
  public changeEmail(payload: ChangeEmailRequestDto): Promise<ChangeEmailResponse> {
    return this.accountService.changeEmail(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.confirmNewEmail)
  public confirmNewEmail(payload: ConfirmNewEmailRequest): Promise<ConfirmNewEmailResponse> {
    return this.accountService.confirmNewEmail(payload.token);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.changePassword)
  public changePassword(payload: ChangePasswordRequestDto): Promise<ChangePasswordResponse> {
    return this.accountService.changePassword(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.createResetPasswordToken)
  public createResetPasswordToken(
    payload: CreateResetPasswordTokenRequestDto,
  ): Promise<CreateResetPasswordTokenResponse> {
    return this.accountService.createResetPasswordToken(payload);
  }

  @GrpcMethod(ACCOUNT_SERVICE_NAME, accountGrpcMethod.changeUsername)
  public changeUsername(payload: ChangeUsernameRequestDto): Promise<ChangeUsernameResponse> {
    return this.accountService.changeUsername(payload);
  }
}
