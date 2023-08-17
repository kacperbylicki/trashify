import { MailerModuleOptions } from '../../types';
import { MailerModuleOptionsFactory } from './mailer-module-options-factory';
import { symbols } from '../../symbols';

export const nestMailerModuleOptionsFactory = {
  provide: symbols.mailerModuleConfig,
  useFactory: (): MailerModuleOptions => {
    const mailerModuleOptionsFactory = new MailerModuleOptionsFactory();

    return mailerModuleOptionsFactory.create();
  },
};
