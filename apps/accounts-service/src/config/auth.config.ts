import { Algorithm } from '../modules/account/enums/algorithm.enum';
import { From } from '@unifig/core';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class AuthConfig {
  @From('JWT_ALGORITHM')
  @IsEnum(Algorithm)
  algorithm!: Algorithm;

  @From('JWT_ACCESS_TOKEN_SECRET')
  @IsString()
  accessTokenSecret!: string;

  @From('JWT_ACCESS_TOKEN_TTL')
  @IsInt()
  accessTokenTTL!: number;

  @From('JWT_REFRESH_TOKEN_SECRET')
  @IsString()
  refreshTokenSecret!: string;

  @From('JWT_REFRESH_TOKEN_TTL')
  @IsInt()
  refreshTokenTTL!: number;
}
