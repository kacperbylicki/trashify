import {
  ACCOUNT_PACKAGE_NAME,
  ACCOUNT_SERVICE_NAME,
  AccountServiceClient,
  MAILING_PACKAGE_NAME,
  MAILING_SERVICE_NAME,
  MailingServiceClient,
} from '@trashify/transport';
import { AccountController } from './controllers';
import { AppConfig } from '@/config';
import { ClientGrpc, ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { EMAILS_FEATURE_FLAG } from './symbols';
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
          const { accountServiceUrl } = Config.getValues(AppConfig);

          return {
            transport: Transport.GRPC,
            options: {
              url: accountServiceUrl,
              package: ACCOUNT_PACKAGE_NAME,
              protoPath: join(__dirname, `../../../proto/account.proto`),
            },
          };
        },
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: MAILING_SERVICE_NAME,
        imports: [ConfigModule.forFeature(AppConfig)],
        inject: [getConfigContainerToken(AppConfig)],
        useFactory: async (): Promise<ClientProvider> => {
          const { mailingServiceUrl } = Config.getValues(AppConfig);

          return {
            transport: Transport.GRPC,
            options: {
              url: mailingServiceUrl,
              package: MAILING_PACKAGE_NAME,
              protoPath: join(__dirname, `../../../proto/mailing.proto`),
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
    {
      provide: MailingServiceClient,
      useFactory: (client: ClientGrpc): MailingServiceClient => {
        return client.getService<MailingServiceClient>(MAILING_SERVICE_NAME);
      },
      inject: [MAILING_SERVICE_NAME],
    },
    JwtService,
    // {
    //   provide: API_GATEWAY_URL_TOKEN,
    //   useFactory: (): string => {
    //     const { apiGatewayUrl } = Config.getValues(AppConfig);
    //     return apiGatewayUrl;
    //   },
    //   inject: [getConfigContainerToken(AppConfig)],
    // },
    {
      provide: EMAILS_FEATURE_FLAG,
      useFactory: (): boolean => {
        const { emailsFeatureFlag } = Config.getValues(AppConfig);
        return emailsFeatureFlag;
      },
      inject: [getConfigContainerToken(AppConfig)],
    },
  ],
  exports: [JwtService],
})
export class AccountModule {}
