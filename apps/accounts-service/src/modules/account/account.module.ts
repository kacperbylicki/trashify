import {
  Account,
  AccountSchema,
  EmailConfirmationToken,
  EmailConfirmationTokenSchema,
  ResetPasswordToken,
  ResetPasswordTokenSchema,
} from './entities';
import { AccountController } from './controllers';
import {
  AccountRepository,
  EmailConfirmationTokenRepository,
  ResetPasswordTokenRepository,
} from './repositories';
import { AccountService, AuthService } from './services';
import { AppConfig, AuthConfig } from '@/config';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { EMAIL_VERIFICATION_FEATURE_FLAG } from './symbols';
import { EmailConfirmationTokenCacheService, ResetPasswordTokenCacheService } from './cache';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

export const accountModuleProviders = [
  AccountService,
  AccountRepository,
  AuthService,
  JwtService,
  ResetPasswordTokenCacheService,
  ResetPasswordTokenRepository,
  EmailConfirmationTokenRepository,
  EmailConfirmationTokenCacheService,
  {
    provide: EMAIL_VERIFICATION_FEATURE_FLAG,
    inject: [getConfigContainerToken(AppConfig)],
    useFactory: (): boolean => {
      const { emailVerificationFeatureFlag } = Config.getValues(AppConfig);

      return emailVerificationFeatureFlag;
    },
  },
];

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(AuthConfig)],
      inject: [getConfigContainerToken(AuthConfig)],
      useFactory: async () => ({
        secret: Config.getValues(AuthConfig).accessTokenSecret,
        signOptions: {
          expiresIn: `${Config.getValues(AuthConfig).accessTokenTTL}s`,
          algorithm: Config.getValues(AuthConfig).algorithm,
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      {
        name: ResetPasswordToken.name,
        schema: ResetPasswordTokenSchema,
      },
      {
        name: EmailConfirmationToken.name,
        schema: EmailConfirmationTokenSchema,
      },
    ]),
  ],
  controllers: [AccountController],
  providers: accountModuleProviders,
})
export class AccountModule {}
