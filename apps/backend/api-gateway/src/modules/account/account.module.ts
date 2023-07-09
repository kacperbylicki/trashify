import {
  ACCOUNT_PACKAGE_NAME,
  ACCOUNT_SERVICE_NAME,
  AccountServiceClient,
} from '@trashify/transport';
import { AccountController } from './controllers';
import { AppConfig } from '@/config';
import {
  ClientGrpc,
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { JwtService } from './services';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACCOUNT_SERVICE_NAME,
        imports: [ConfigModule.forFeature(AppConfig)],
        inject: [getConfigContainerToken(AppConfig)],
        useFactory: async (): Promise<ClientProvider> => {
          const { accountServicePort, protoPath } = Config.getValues(AppConfig);

          return {
            transport: Transport.GRPC,
            options: {
              url: `trashify-accounts-service:${accountServicePort}`,
              package: ACCOUNT_PACKAGE_NAME,
              protoPath: join(__dirname, `${protoPath}/proto/account.proto`),
            },
          };
        },
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [
    {
      provide: AccountServiceClient,
      useFactory: (client: ClientGrpc): AccountServiceClient =>
        client.getService<AccountServiceClient>(ACCOUNT_SERVICE_NAME),
      inject: [ACCOUNT_SERVICE_NAME],
    },
    JwtService,
  ],
  exports: [JwtService],
})
export class AccountModule {}
