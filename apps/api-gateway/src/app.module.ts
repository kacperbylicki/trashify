import { AccountModule, HealthModule } from '@/modules';
import { AppConfig } from '@/config';
import { ConfigModule } from '@unifig/nest';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ default: AppConfig }),
    // TODO: Uncomment this when redis service is running
    // CacheModule.registerAsync({
    //   inject: [getConfigContainerToken(AppConfig)],
    //   useFactory: async () => {
    //     const {
    //       apiGatewayCacheHost,
    //       apiGatewayCachePort,
    //       apiGatewayCachePassword,
    //       apiGatewayCacheTTL,
    //     } = Config.getValues(AppConfig);

    //     const store = await redisStore({
    //       socket: {
    //         host: apiGatewayCacheHost,
    //         port: apiGatewayCachePort,
    //       },
    //       password: apiGatewayCachePassword,
    //     });

    //     return {
    //       store: store as unknown as CacheStore,
    //       ttl: apiGatewayCacheTTL,
    //     };
    //   },
    //   isGlobal: true,
    // }),
    AccountModule,
    HealthModule,
  ],
})
export class AppModule {}
