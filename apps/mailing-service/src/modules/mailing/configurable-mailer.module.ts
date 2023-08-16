import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MailerModuleOptions } from './types';
import { symbols } from './symbols';

export const { ConfigurableModuleClass: ConfigurableAzureMailerModule } =
  new ConfigurableModuleBuilder<MailerModuleOptions>({
    optionsInjectionToken: symbols.mailerModuleConfig,
  }).build();
