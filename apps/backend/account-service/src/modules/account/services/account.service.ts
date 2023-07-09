import argon2 from 'argon2';
import dayjs from 'dayjs';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';
import { AuthService } from './auth.service';
import {
  GetAccountResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@trashify/transport';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
} from '../dtos';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountService {
  constructor(
    private readonly authService: AuthService,
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
        error: ['invalid email or password'],
      };
    }

    const isPasswordCorrect = await argon2.verify(
      account.password,
      payload.password,
    );

    if (!isPasswordCorrect) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['invalid email or password'],
      };
    }

    const { accessToken, refreshToken } =
      await this.authService.createTokensPair(account);

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
        error: ['cannot process the request'],
      };
    }

    if (payload.password !== payload.confirmPassword) {
      return {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: ['passwords does not match'],
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

  async refreshToken(
    request: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponse> {
    const account = await this.findById(request.accountId);

    if (!account || !request.refreshToken || !account.refreshToken) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['invalid refresh token'],
      };
    }

    const isRefreshTokenMatching = await argon2.verify(
      account.refreshToken,
      request.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['invalid refresh token'],
      };
    }

    const tokens = await this.authService.createTokensPair(account);

    return {
      status: HttpStatus.OK,
      data: tokens,
    };
  }

  async logout(accountId: string): Promise<LogoutResponse> {
    await this.accountRepository.update(accountId, { refreshToken: null });

    return { status: HttpStatus.OK };
  }
}
