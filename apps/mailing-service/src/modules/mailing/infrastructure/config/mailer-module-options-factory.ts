import { AvailableMailers, MailerModuleOptions } from '../../types';
import { ClassConstructor } from 'class-transformer';
import { Config } from '@unifig/core';
import { EmailClientOptions } from '@azure/communication-email';
import { FactoryLike } from '../../../../common/types/factory-like';
import { MailerConfig } from '../../../../config';

export class MailerModuleOptionsFactory implements FactoryLike<MailerModuleOptions> {
  create(): MailerModuleOptions {
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
  }
}
