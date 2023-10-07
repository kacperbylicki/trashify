import { Account, AccountSchema, ResetPasswordToken, ResetPasswordTokenSchema } from './entities';
import { AccountController } from './controllers';
import { AccountRepository, ResetPasswordTokenRepository } from './repositories';
import { AccountService, AuthService } from './services';
import { AuthConfig } from '@/config';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetPasswordTokenCacheService } from './cache';

export const accountModuleProviders = [
  AccountService,
  AccountRepository,
  AuthService,
  JwtService,
  ResetPasswordTokenCacheService,
  ResetPasswordTokenRepository,
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
    ]),
  ],
  controllers: [AccountController],
  providers: accountModuleProviders,
})
export class AccountModule {}
