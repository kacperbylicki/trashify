import { AvailableMailers, MailerModuleOptions } from '../../../types';
import { AwsSESMailerService } from '../aws-ses/aws-ses-mailer.service';
import { InternalServerException } from '../../../../../common/exceptions/internal-server-exception';
import { MailerService } from '../../../application/services/mailer-service';
import { SESv2Client } from '@aws-sdk/client-sesv2';

export class MailerServiceFactory {
  public constructor(
    private readonly mailerClient: unknown,
    private readonly mailerConfig: MailerModuleOptions,
  ) {}

  create(): MailerService {
    if (this.mailerConfig.type === AvailableMailers.SES) {
      return new AwsSESMailerService(this.mailerClient as SESv2Client);
    }

    throw new InternalServerException({
      message: 'Invalid mailer type provided.',
      method: 'create',
      source: 'MailerServiceFactory',
    });
  }
}
