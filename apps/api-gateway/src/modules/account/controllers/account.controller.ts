import { API_GATEWAY_URL_TOKEN, EMAILS_FEATURE_FLAG } from '../symbols';
import {
  AccountServiceClient,
  GetAccountResponse,
  LoginResponse,
  LogoutResponse,
  MailingServiceClient,
  RefreshTokenResponse,
  RegisterResponse,
} from '@trashify/transport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ChangeEmailDto,
  ChangeEmailResponseDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
  ChangeUsernameDto,
  ChangeUsernameResponseDto,
  ConfirmNewEmailRequestDto,
  ConfirmNewEmailResponseDto,
  ConfirmRegistrationRequestDto,
  ConfirmRegistrationResponseDto,
  GetAccountResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from '../dtos';
import {
  HttpStatusInterceptor,
  JwtAuthGuard,
  Public,
  RefreshJwtAuthGuard,
  RequestAccountId,
  RequestRefreshToken,
  TimeoutInterceptor,
} from '@/common';
import { Observable, first, map } from 'rxjs';
import {
  getEmailChangeRequestEmailTemplate,
  getPasswordChangedEmailTemplate,
  getRegistrationConfirmationEmailTemplate,
  getResetPasswordEmailTemplate,
} from '../templates';

@Controller('accounts')
@ApiTags(AccountController.name)
@UseInterceptors(TimeoutInterceptor, HttpStatusInterceptor)
export class AccountController {
  private logger: Logger;

  public constructor(
    private readonly accountsClient: AccountServiceClient,
    private readonly mailingClient: MailingServiceClient,
    @Inject(API_GATEWAY_URL_TOKEN)
    private readonly baseUrl: string,
    @Inject(EMAILS_FEATURE_FLAG)
    private readonly emailsFeatureFlag: boolean,
  ) {
    this.logger = new Logger(AccountController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    type: GetAccountResponseDto,
    description: `Currently logged account retrieved`,
  })
  @ApiBearerAuth()
  async currentAccount(
    @RequestAccountId() accountId: string,
  ): Promise<Observable<GetAccountResponse>> {
    return this.accountsClient.getAccount({ accountId });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ type: LoginResponseDto, description: `Logged in` })
  async login(@Body() dto: LoginRequestDto): Promise<Observable<LoginResponse>> {
    return this.accountsClient.login(dto).pipe(
      map((response) => {
        return response;
      }),
    );
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: `Account created`,
  })
  async register(@Body() dto: RegisterRequestDto): Promise<Observable<RegisterResponse>> {
    return this.accountsClient.register(dto).pipe(
      map((response) => {
        if (response.status !== HttpStatus.CREATED) {
          return response;
        }

        if (this.emailsFeatureFlag && response.email && response.username) {
          this.mailingClient
            .sendEmail(
              getRegistrationConfirmationEmailTemplate({
                email: response.email,
                username: response.username,
                url: `${this.baseUrl}/confirm-registration`,
              }),
            )
            .pipe(first())
            .subscribe((value) => {
              this.logger.log(`Email sending result: ${value?.ok}`);
            });
        }

        return response;
      }),
    );
  }

  @Public()
  @ApiQuery({
    type: ConfirmRegistrationRequestDto,
  })
  @Post('confirm-registration')
  async confirmRegistration(
    @Query('uuid') uuid: string,
  ): Promise<Observable<ConfirmRegistrationResponseDto>> {
    return this.accountsClient.confirmRegistration({
      uuid,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `Logged out` })
  @ApiBearerAuth()
  async logout(@RequestAccountId() accountId: string): Promise<Observable<LogoutResponse>> {
    return this.accountsClient.logout({ accountId });
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({
    type: RefreshTokenResponseDto,
    description: `Access token refreshed`,
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  async refreshToken(
    @RequestAccountId() accountId: string,
    @RequestRefreshToken() refreshToken: string,
  ): Promise<Observable<RefreshTokenResponse>> {
    return this.accountsClient.refreshToken({ accountId, refreshToken });
  }

  @UseGuards(JwtAuthGuard)
  @Post('email')
  @ApiOkResponse({
    type: ChangeEmailResponseDto,
    description: 'Email changed.',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  public async changeEmail(
    @RequestAccountId() accountId: string,
    @Body() request: ChangeEmailDto,
  ): Promise<Observable<ChangeEmailResponseDto>> {
    const { email } = request;

    return this.accountsClient
      .changeEmail({
        uuid: accountId,
        email,
      })
      .pipe(
        map((response) => {
          if (response.status !== HttpStatus.OK) {
            return response;
          }

          if (this.emailsFeatureFlag && response.email && response.username) {
            this.mailingClient
              .sendEmail(
                getEmailChangeRequestEmailTemplate({
                  email: response.email,
                  url: `${this.baseUrl}/confirm-email`,
                  username: response.username,
                }),
              )
              .pipe(first())
              .subscribe((value) => {
                this.logger.log(`Email sending result: ${value?.ok}`);
              });
          }

          return {
            status: HttpStatus.OK,
            email: response.email,
          };
        }),
      );
  }

  @UseGuards(JwtAuthGuard)
  @Post('username')
  @ApiOkResponse({
    type: ChangeUsernameResponseDto,
    description: 'Account username changed.',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  public async changeUsername(
    @RequestAccountId() accountId: string,
    @Body() request: ChangeUsernameDto,
  ): Promise<Observable<ChangeUsernameResponseDto>> {
    return this.accountsClient.changeUsername({
      username: request.username,
      uuid: accountId,
    });
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPasswordResponseDto,
    description: 'Reset password link sent',
  })
  public async createResetPasswordToken(
    @Body() request: ResetPasswordDto,
  ): Promise<Observable<ResetPasswordResponseDto>> {
    const { email } = request;

    const result = this.accountsClient.createResetPasswordToken({
      email,
    });

    return result.pipe(
      map((response) => {
        if (response.status !== HttpStatus.OK) {
          return {
            status: HttpStatus.OK,
          };
        }

        if (this.emailsFeatureFlag && response.email && response.username) {
          this.mailingClient
            .sendEmail(
              getResetPasswordEmailTemplate({
                email: response.email,
                url: `${this.baseUrl}/change-password/${response.token}`,
                username: response.username,
              }),
            )
            .pipe(first())
            .subscribe((value) => {
              this.logger.log(`Email sending result: ${value?.ok}`);
            });
        }

        return {
          status: HttpStatus.OK,
        };
      }),
    );
  }

  @Post('change-password')
  @ApiOkResponse({
    type: ChangePasswordResponseDto,
    description: 'Password changed.',
  })
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @Query('token') token: string,
    @Body() request: ChangePasswordDto,
  ): Promise<Observable<ChangePasswordResponseDto>> {
    const { password, repeatedPassword } = request;

    return this.accountsClient
      .changePassword({
        password,
        repeatedPassword,
        token,
      })
      .pipe(
        map((response) => {
          if (response.status !== HttpStatus.OK) {
            return response;
          }

          if (this.emailsFeatureFlag && response.email && response.username) {
            this.mailingClient
              .sendEmail(
                getPasswordChangedEmailTemplate({
                  email: response.email,
                  username: response.username,
                }),
              )
              .pipe(first())
              .subscribe((value) => {
                this.logger.log(`Change password email sent: ${value?.ok}`);
              });
          }

          return response;
        }),
      );
  }

  @Patch('confirm-email')
  @ApiQuery({
    type: ConfirmNewEmailRequestDto,
  })
  @HttpCode(HttpStatus.OK)
  public async confirmEmail(
    @Query('token') token: string,
  ): Promise<Observable<ConfirmNewEmailResponseDto>> {
    return this.accountsClient.confirmNewEmail({
      token,
    });
  }
}
