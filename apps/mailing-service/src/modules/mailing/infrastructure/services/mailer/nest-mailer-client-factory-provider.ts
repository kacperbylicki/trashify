import { MailerClientFactory } from './mailer-client-factory';
import { MailerModuleOptions } from '../../../types';
import { symbols } from '../../../symbols';

export const nestMailerClientFactoryProvider = {
  provide: symbols.mailerClient,
  useFactory: (mailerConfig: MailerModuleOptions): unknown => {
    const mailerClientFactory = new MailerClientFactory(mailerConfig);

    return mailerClientFactory.create();
  },
  inject: [symbols.mailerModuleConfig],
};
