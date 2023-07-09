import { AccountModule } from '@/modules';
import { AppConfig, AuthConfig, DatabaseConfig } from '@/config';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      templates: [AuthConfig, DatabaseConfig],
      default: AppConfig,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabaseConfig)],
      inject: [getConfigContainerToken(DatabaseConfig)],
      useFactory: async () => ({
        uri: Config.getValues(DatabaseConfig).uri,
      }),
    }),
    AccountModule,
  ],
})
export class AppModule {}
