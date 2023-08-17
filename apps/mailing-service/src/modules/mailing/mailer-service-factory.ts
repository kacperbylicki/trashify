import { AvailableMailers, AzureMailerOptions, MailerModuleOptions } from './types';
import { AwsSESMailerService } from './services/aws-ses/aws-ses-mailer.service';
import { AzureMailerService } from './services';
import { EmailClient } from '@azure/communication-email';
import { Logger } from '@nestjs/common';
import { MailerService } from './services/mailer-service';
import { SESv2Client } from '@aws-sdk/client-sesv2';

export class MailerServiceFactory {
  public constructor(
    private readonly mailerClient: unknown,
    private readonly mailerConfig: MailerModuleOptions,
    private readonly logger?: Logger,
  ) {}

  create(): MailerService {
    if (this.mailerConfig.type === AvailableMailers.AZURE) {
      return new AzureMailerService(
        this.mailerConfig as AzureMailerOptions,
        this.mailerClient as EmailClient,
        this.logger,
      );
    }
    if (this.mailerConfig.type === AvailableMailers.SES) {
      return new AwsSESMailerService(this.mailerClient as SESv2Client);
    }

    throw new Error();
  }
}
