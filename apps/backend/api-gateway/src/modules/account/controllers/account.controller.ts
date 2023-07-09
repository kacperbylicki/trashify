import {
  AccountServiceClient,
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
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  GetAccountResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
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
import { Observable } from 'rxjs';

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
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<Observable<LoginResponse>> {
    return this.client.login(dto);
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: `Account created`,
  })
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<Observable<RegisterResponse>> {
    return this.client.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: `Invalid token` })
  @ApiOkResponse({ description: `Logged out` })
  @ApiBearerAuth()
  async logout(
    @RequestAccountId() accountId: string,
  ): Promise<Observable<LogoutResponse>> {
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
}
