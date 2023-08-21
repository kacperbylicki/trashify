import { ClassConstructor } from 'class-transformer';
import { Config } from '@unifig/core';
import { FactoryLike } from '../../../../common/types/factory-like';
import { MailerConfig } from '../../../../config';
import { MailerModuleOptions } from '../../types';

export class MailerModuleOptionsFactory implements FactoryLike<MailerModuleOptions> {
  create(): MailerModuleOptions {
    const mailerConfig = Config.getValues<MailerModuleOptions>(
      MailerConfig as unknown as ClassConstructor<MailerModuleOptions>,
    );

    return {
      type: mailerConfig.type,
      region: mailerConfig.region,
      accessKeyId: mailerConfig.accessKeyId,
      secretAccessKey: mailerConfig.secretAccessKey,
    };
  }
}
