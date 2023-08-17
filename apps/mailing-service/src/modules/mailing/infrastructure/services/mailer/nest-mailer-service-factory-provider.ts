import { MailerModuleOptions } from '../../../types';
import { MailerService } from '../../../application';
import { MailerServiceFactory } from './mailer-service-factory';
import { symbols } from '../../../symbols';

export const nestMailerServiceFactoryProvider = {
  provide: symbols.mailerService,
  useFactory: (mailerConfig: MailerModuleOptions, mailerClient: unknown): MailerService => {
    const mailerServiceFactory = new MailerServiceFactory(mailerClient, mailerConfig);

    return mailerServiceFactory.create();
  },
  inject: [symbols.mailerModuleConfig, symbols.mailerClient],
};
