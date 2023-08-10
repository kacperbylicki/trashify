import { AzureMailerModuleOptions } from './types';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass: ConfigurableAzureMailerModule,
  MODULE_OPTIONS_TOKEN: AZURE_MAILER_MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<AzureMailerModuleOptions>().build();
