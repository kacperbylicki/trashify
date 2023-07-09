import { AccountModule, HealthModule } from '@/modules';
import { AppConfig } from '@/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheStore, Module } from '@nestjs/common';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ default: AppConfig }),
    CacheModule.registerAsync({
      inject: [getConfigContainerToken(AppConfig)],
      useFactory: async () => {
        const {
          apiGatewayCacheHost,
          apiGatewayCachePort,
          apiGatewayCachePassword,
          apiGatewayCacheTTL,
        } = Config.getValues(AppConfig);

        const store = await redisStore({
          socket: {
            host: apiGatewayCacheHost,
            port: apiGatewayCachePort,
          },
          password: apiGatewayCachePassword,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: apiGatewayCacheTTL,
        };
      },
      isGlobal: true,
    }),
    AccountModule,
    HealthModule,
  ],
})
export class AppModule {}
