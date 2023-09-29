import { AppConfig } from './config';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { DatabaseConfig } from './config/database.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrashModule } from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      templates: [DatabaseConfig],
      default: AppConfig,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabaseConfig)],
      inject: [getConfigContainerToken(DatabaseConfig)],
      useFactory: async () => ({
        uri: Config.getValues(DatabaseConfig).uri,
      }),
    }),
    TrashModule,
  ],
})
export class AppModule {}
