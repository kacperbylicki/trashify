import { AppConfig, MailerConfig } from './config';
import { AvailableMailers, MailerModule, MailerModuleOptions } from './modules';
import { ClassConstructor } from 'class-transformer';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { EmailClientOptions } from '@azure/communication-email';
import { Module } from '@nestjs/common';
import { symbols } from './modules/mailing/symbols';

@Module({
  imports: [
    ConfigModule.forRoot({ default: AppConfig, templates: [AppConfig, MailerConfig] }),
    MailerModule.registerAsync({
      useFactory: (): MailerModuleOptions => {
        // TODO: Remove :)
        const mailerConfig = Config.getValues<MailerModuleOptions>(
          MailerConfig as ClassConstructor<MailerModuleOptions>,
        );

        if (mailerConfig.type === AvailableMailers.AZURE) {
          return {
            type: mailerConfig.type,
            connectionString: mailerConfig.connectionString,
            defaultFromEmail: mailerConfig.defaultFromEmail,
            clientOptions: mailerConfig.clientOptions as EmailClientOptions,
            pollerWaitTimeInMs: mailerConfig.pollerWaitTimeInMs,
          };
        }

        return {
          type: mailerConfig.type,
          region: mailerConfig.region,
          accessKeyId: mailerConfig.accessKeyId,
          secretAccessKey: mailerConfig.secretAccessKey,
        };
      },
      inject: [getConfigContainerToken(MailerConfig)],
    }),
  ],
  providers: [
    {
      provide: symbols.mailerModuleConfig,
      useFactory: () => {
        const mailerConfig = Config.getValues<MailerModuleOptions>(
          MailerConfig as ClassConstructor<MailerModuleOptions>,
        );

        if (mailerConfig.type === AvailableMailers.AZURE) {
          return {
            type: mailerConfig.type,
            connectionString: mailerConfig.connectionString,
            defaultFromEmail: mailerConfig.defaultFromEmail,
            clientOptions: mailerConfig.clientOptions as EmailClientOptions,
            pollerWaitTimeInMs: mailerConfig.pollerWaitTimeInMs,
          };
        }

        return {
          type: mailerConfig.type,
          region: mailerConfig.region,
          accessKeyId: mailerConfig.accessKeyId,
          secretAccessKey: mailerConfig.secretAccessKey,
        };
      },
      inject: [getConfigContainerToken(MailerConfig)],
    },
  ],
})
export class AppModule {}
