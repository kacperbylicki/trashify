import { AvailableMailers, MailerModuleOptions } from './types';
import { AwsSESClientFactory } from './services/aws-ses/ses-client-factory';
import { AzureMailerClientFactory } from './services/azure-mailer/azure-mailer-client-factory';
import { FactoryLike } from '../../common/types/factory-like';

export class MailerClientFactory implements FactoryLike<unknown> {
  constructor(private readonly mailerConfig: MailerModuleOptions) {}

  create(): unknown {
    if (this.mailerConfig.type === AvailableMailers.AZURE) {
      return new AzureMailerClientFactory(this.mailerConfig).create();
    }

    if (this.mailerConfig.type === AvailableMailers.SES) {
      return new AwsSESClientFactory(this.mailerConfig).create();
    }

    throw new Error('ModuleConfigError!');
  }
}
