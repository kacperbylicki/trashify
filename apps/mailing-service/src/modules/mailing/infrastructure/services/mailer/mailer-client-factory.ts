import { AvailableMailers, MailerModuleOptions } from '../../../types';
import { AwsSESClientFactory } from '../aws-ses/ses-client-factory';
import { FactoryLike } from '../../../../../common/types/factory-like';
import { InternalServerException } from '../../../../../common/exceptions/internal-server-exception';

export class MailerClientFactory implements FactoryLike<unknown> {
  constructor(private readonly mailerConfig: MailerModuleOptions) {}

  create(): unknown {
    if (this.mailerConfig.type === AvailableMailers.SES) {
      return new AwsSESClientFactory(this.mailerConfig).create();
    }

    throw new InternalServerException({
      message: 'Invalid mailer type provided.',
      method: 'create',
      source: 'MailerClientFactory',
    });
  }
}
