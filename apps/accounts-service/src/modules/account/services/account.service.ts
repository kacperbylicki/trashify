import argon2 from 'argon2';
import dayjs from 'dayjs';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';
import { AuthService } from './auth.service';
import {
  ChangeEmailRequestDto,
  ChangePasswordRequestDto,
  ChangeUsernameRequestDto,
  CreateResetPasswordTokenRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
} from '../dtos';
import {
  ChangeEmailResponse,
  ChangePasswordResponse,
  ChangeUsernameResponse,
  CreateResetPasswordTokenResponse,
  GetAccountResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@trashify/transport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ResetPasswordTokenCacheService } from '../cache';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountService {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordTokenCacheService: ResetPasswordTokenCacheService,
    private readonly accountRepository: AccountRepository,
  ) {}

  async findById(uuid: string): Promise<Account | null> {
    return this.accountRepository.findById(uuid);
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findByEmail(email);
  }

  async getCurrentAccount(accountId: string): Promise<GetAccountResponse> {
    const account = await this.findById(accountId);

    return { status: HttpStatus.OK, data: account };
  }

  async login(payload: LoginRequestDto): Promise<LoginResponse> {
    const account = await this.findByEmail(payload.email);

    if (!account) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid email or password.'],
      };
    }

    const isPasswordCorrect = await argon2.verify(account.password, payload.password);

    if (!isPasswordCorrect) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid email or password.'],
      };
    }

    const { accessToken, refreshToken } = await this.authService.createTokensPair(account);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.accountRepository.update(account.uuid, {
      refreshToken: hashedRefreshToken,
    });

    return {
      status: HttpStatus.OK,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    const emailExists = await this.accountRepository.exists(payload.email);

    if (emailExists) {
      return {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: ['Email already taken.'],
      };
    }

    if (payload.password !== payload.confirmPassword) {
      return {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: ['Passwords do not match.'],
      };
    }

    const account = {
      ...payload,
      uuid: uuidv4(),
      password: await argon2.hash(payload.password),
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    };

    await this.accountRepository.save(account);

    return { status: HttpStatus.CREATED };
  }

  async refreshToken(request: RefreshTokenRequestDto): Promise<RefreshTokenResponse> {
    const account = await this.findById(request.accountId);

    if (!account || !request.refreshToken || !account.refreshToken) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid refresh token.'],
      };
    }

    const isRefreshTokenMatching = await argon2.verify(account.refreshToken, request.refreshToken);

    if (!isRefreshTokenMatching) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid refresh token.'],
      };
    }

    const tokens = await this.authService.createTokensPair(account);

    return {
      status: HttpStatus.OK,
      data: tokens,
    };
  }

  public async changeEmail(payload: ChangeEmailRequestDto): Promise<ChangeEmailResponse> {
    const { email, uuid } = payload;

    const emailAlreadyExists = await this.findByEmail(email);

    const userExists = await this.findById(uuid);

    if (emailAlreadyExists || !userExists) {
      return {
        status: HttpStatus.CONFLICT,
        email,
        error: ['Email already taken.'],
      };
    }

    await this.accountRepository.update(uuid, {
      email,
    });

    return {
      status: HttpStatus.OK,
      email,
      error: [],
    };
  }

  public async changeUsername(payload: ChangeUsernameRequestDto): Promise<ChangeUsernameResponse> {
    const { username, uuid } = payload;

    const userExists = await this.findById(uuid);

    if (!userExists) {
      return {
        status: HttpStatus.BAD_REQUEST,
        username,
        error: ['User not found.'],
      };
    }

    await this.accountRepository.update(uuid, {
      username,
    });

    return {
      status: HttpStatus.OK,
      username,
      error: [],
    };
  }

  public async createResetPasswordToken(
    payload: CreateResetPasswordTokenRequestDto,
  ): Promise<CreateResetPasswordTokenResponse> {
    const { email } = payload;

    const userExists = await this.accountRepository.findByEmail(email);

    if (!userExists) {
      return {
        error: ['User does not exist.'],
        status: HttpStatus.BAD_REQUEST,
      };
    }

    const token = await this.authService.createResetPasswordToken();

    // TODO: Delete upon connecting emails
    //eslint-disable-next-line
    console.log(token);

    await this.resetPasswordTokenCacheService.set(token, userExists.uuid);

    return {
      token: token,
      status: HttpStatus.OK,
      error: [],
    };
  }

  public async changePassword(payload: ChangePasswordRequestDto): Promise<ChangePasswordResponse> {
    const { password, repeatedPassword, token } = payload;

    const userId = await this.resetPasswordTokenCacheService.get(token);

    if (!userId) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['Invalid token.'],
      };
    }

    const passwordRepeatedCorrectly = password === repeatedPassword;

    if (!passwordRepeatedCorrectly) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['Password is not the same as repeated password.'],
      };
    }

    await this.accountRepository.update(userId, {
      password,
    });

    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  async logout(accountId: string): Promise<LogoutResponse> {
    await this.accountRepository.update(accountId, { refreshToken: null });

    return { status: HttpStatus.OK };
  }
}
