import {
  AccountServiceClient,
  ChangeUsernameResponse,
  GetAccountResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@trashify/transport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { Observable, map } from 'rxjs';

@Controller('accounts')
@ApiTags(AccountController.name)
@UseInterceptors(TimeoutInterceptor, HttpStatusInterceptor)
export class AccountController {
  public constructor(private readonly client: AccountServiceClient) {}

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
    return this.client.getAccount({ accountId });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ type: LoginResponseDto, description: `Logged in` })
  async login(@Body() dto: LoginRequestDto): Promise<Observable<LoginResponse>> {
    return this.client.login(dto);
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: `Account created`,
  })
  async register(@Body() dto: RegisterRequestDto): Promise<Observable<RegisterResponse>> {
    return this.client.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `Logged out` })
  @ApiBearerAuth()
  async logout(@RequestAccountId() accountId: string): Promise<Observable<LogoutResponse>> {
    return this.client.logout({ accountId });
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
    return this.client.refreshToken({ accountId, refreshToken });
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

    return this.client.changeEmail({
      uuid: accountId,
      email,
    });
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
    return this.client.changeUsername({
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

    const result = this.client.createResetPasswordToken({
      email,
    });

    return result.pipe(
      map(() => {
        return {
          // TODO: Add conditional email dispatch, unless there is a better way :)
          status: HttpStatus.OK,
        };
      }),
    );
  }

  @Post('change-password/:token')
  @ApiOkResponse({
    type: ChangePasswordResponseDto,
    description: 'Password changed.',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @Param('token') token: string,
    @Body() request: ChangePasswordDto,
  ): Promise<Observable<ChangePasswordResponseDto>> {
    const { password, repeatedPassword } = request;

    return this.client.changePassword({
      password,
      repeatedPassword,
      token,
    });
  }
}
