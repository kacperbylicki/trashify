import {
  Account,
  Tokens,
  ValidateJwtResponse,
  ValidateRefreshJwtResponse,
} from '@trashify/transport';
import { AuthConfig } from '@/config';
import { ConfigContainer } from '@unifig/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConfig } from '@unifig/nest';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectConfig(AuthConfig) private authConfig: ConfigContainer<AuthConfig>,
    private readonly jwtService: JwtService,
  ) {}

  public async createTokensPair(account: Account): Promise<Tokens> {
    const { accessTokenSecret, accessTokenTTL, refreshTokenSecret, refreshTokenTTL } =
      this.authConfig.values;

    const accountData = {
      uuid: account.uuid,
      email: account.email,
      username: account.username,
    };

    const accessToken = await this.jwtService.signAsync(accountData, {
      secret: accessTokenSecret,
      expiresIn: accessTokenTTL,
    });

    const refreshToken = await this.jwtService.signAsync(accountData, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenTTL,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async validateJwt(token: string): Promise<ValidateJwtResponse> {
    const { accessTokenSecret } = this.authConfig.values;

    try {
      const decodedAccessToken = await this.jwtService.verifyAsync(token, {
        secret: accessTokenSecret,
      });

      return {
        status: HttpStatus.OK,
        data: {
          isValid: true,
          accountId: decodedAccessToken.uuid,
        },
      };
    } catch (error) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: [(error as Error)?.message],
      };
    }
  }

  public async validateRefreshJwt(token: string): Promise<ValidateRefreshJwtResponse> {
    const { refreshTokenSecret } = this.authConfig.values;

    try {
      const decodedRefreshToken = await this.jwtService.verifyAsync(token, {
        secret: refreshTokenSecret,
      });

      return {
        status: HttpStatus.OK,
        data: {
          isValid: true,
          accountId: decodedRefreshToken.uuid,
        },
      };
    } catch (error: any) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: [error?.message],
      };
    }
  }

  public async createResetPasswordToken(): Promise<string> {
    const token = await this.jwtService.signAsync({});

    return token;
  }
}
