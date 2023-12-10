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
  ChangePasswordTemplateDto,
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
  ResendRegistrationConfirmationEmailRequestDto,
  ResendRegistrationConfirmationEmailResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from '../dtos';
import { EMAILS_FEATURE_FLAG } from '../symbols';
import {
  HttpStatusInterceptor,
  JwtAuthGuard,
  Public,
  RefreshJwtAuthGuard,
  RequestAccountId,
  RequestRefreshToken,
  TimeoutInterceptor,
} from '@/common';
import { Observable, first, map, of } from 'rxjs';
import { SendHtmlResponseInterceptor } from '../../../common/interceptors/send-html-response.interceptor';
import {
  getChangePasswordTemplate,
  getNewEmailConfirmedTemplate,
  getRegistrationConfirmedTemplate,
} from '../templates';
import {
  getEmailChangeRequestEmailTemplate,
  getPasswordChangedEmailTemplate,
  getRegistrationConfirmationEmailTemplate,
  getResetPasswordEmailTemplate,
} from '../templates/email';

@Controller('accounts')
@ApiTags(AccountController.name)
@UseInterceptors(TimeoutInterceptor, HttpStatusInterceptor)
export class AccountController {
  private logger: Logger;
  private baseUrl: string;

  public constructor(
    private readonly accountsClient: AccountServiceClient,
    private readonly mailingClient: MailingServiceClient,
    @Inject(EMAILS_FEATURE_FLAG)
    private readonly emailsFeatureFlag: boolean,
  ) {
    this.logger = new Logger(AccountController.name);
    this.baseUrl = process.env.API_GATEWAY_URL as string;
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
                url: `${this.baseUrl}/api/v1/accounts/confirm-registration?uuid=${response.uuid}`,
              }),
            )
            .pipe(first())
            .subscribe((value) => {
              this.logger.log(`Email sending result: ${value?.ok}`);
            });
        }

        return {
          status: response.status,
        };
      }),
    );
  }

  @Public()
  @ApiBody({
    type: ResendRegistrationConfirmationEmailRequestDto,
  })
  @ApiOkResponse({
    type: ResendRegistrationConfirmationEmailResponseDto,
  })
  @Post('resend-verification')
  public async resendEmailConfirmation(
    @Body() payload: ResendRegistrationConfirmationEmailRequestDto,
  ): Promise<Observable<ResendRegistrationConfirmationEmailResponseDto>> {
    return this.accountsClient.resendRegistrationConfirmationEmail(payload).pipe(
      map((response) => {
        if (response.status !== HttpStatus.OK) {
          return response;
        }

        if (response.email && response.username && response.uuid) {
          this.mailingClient
            .sendEmail(
              getRegistrationConfirmationEmailTemplate({
                email: response.email,
                url: `${this.baseUrl}/api/v1/accounts/confirm-registration?uuid=${response.uuid}`,
                username: response.username,
              }),
            )
            .pipe(first())
            .subscribe((value) => {
              this.logger.log(`Email sending result: ${value?.ok}`);
            });
        }

        return {
          status: response.status,
          error: response.error,
        };
      }),
    );
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

          if (this.emailsFeatureFlag && response.email && response.username && response.token) {
            this.mailingClient
              .sendEmail(
                getEmailChangeRequestEmailTemplate({
                  email: response.email,
                  url: `${this.baseUrl}/api/v1/accounts/confirm-email?token=${response.token}`,
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
                url: `${this.baseUrl}/api/v1/accounts/change-password?token=${response.token}`,
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

  @Public()
  @UseInterceptors(SendHtmlResponseInterceptor)
  @Get('change-password')
  public changePasswordForm(): Observable<ChangePasswordTemplateDto> {
    return of({
      status: HttpStatus.OK,
      html: getChangePasswordTemplate(`${this.baseUrl}/api/v1/accounts/change-password?token=`),
      error: [],
    });
  }

  @Public()
  @ApiQuery({
    type: ConfirmRegistrationRequestDto,
  })
  @UseInterceptors(SendHtmlResponseInterceptor)
  @Get('confirm-registration')
  public async confirmRegistration(
    @Query('uuid') uuid: string,
  ): Promise<Observable<ConfirmRegistrationResponseDto>> {
    return this.accountsClient
      .confirmRegistration({
        uuid,
      })
      .pipe(
        map((response) => {
          if (response.status === HttpStatus.OK) {
            return {
              status: response.status,
              html: getRegistrationConfirmedTemplate(true),
              error: [],
            };
          }

          return {
            status: response.status,
            error: [],
            html: getRegistrationConfirmedTemplate(false),
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

  @Public()
  @UseInterceptors(SendHtmlResponseInterceptor)
  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  public confirmEmailTemplate(): Observable<{ html: string; status: number }> {
    return of({
      html: getNewEmailConfirmedTemplate(`'${this.baseUrl}/api/v1/accounts/confirm-email?token='`),
      status: HttpStatus.OK,
    });
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
