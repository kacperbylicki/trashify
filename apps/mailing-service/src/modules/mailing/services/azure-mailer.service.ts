import { AZURE_MAILER_MODULE_OPTIONS_TOKEN } from '../configurable-azure-mailer.module';
import { AzureIdentityProvider } from '../../identity';
import { AzureMailerModuleOptions, Poller } from '../types';
import { EMAILS_FEATURE_FLAG } from '../symbols';
import {
  EmailClient,
  EmailMessage,
  EmailSendResponse,
  KnownEmailSendStatus,
} from '@azure/communication-email';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { PollerNoResultException, PollerNotStartedException } from '../exception';
import { delay } from '../../../common/util';

@Injectable()
export class AzureMailerService {
  private emailClient!: EmailClient;
  constructor(
    @Inject(AZURE_MAILER_MODULE_OPTIONS_TOKEN)
    private readonly options: AzureMailerModuleOptions,
    @Inject(EMAILS_FEATURE_FLAG)
    private readonly emailsFeatureFlag: boolean,
    @Optional()
    azureIdentityProvider: AzureIdentityProvider,
    @Optional()
    private readonly logger: Logger,
  ) {
    if (!emailsFeatureFlag) {
      return;
    }

    if (azureIdentityProvider) {
      this.emailClient = new EmailClient(
        options.connectionString,
        azureIdentityProvider.azureCredential,
        options.clientOptions,
      );
      return;
    }

    if (!logger) {
      this.logger = new Logger(AzureMailerService.name);
    }

    this.emailClient = new EmailClient(`endpoint=${options.connectionString}`, {
      ...options.clientOptions,
    });
  }

  async sendEmail(msg: Omit<EmailMessage, 'senderAddress'>): Promise<void> {
    if (!this.emailsFeatureFlag) {
      this.logger.log(AzureMailerService.name, {
        info: 'Email processing skipped.',
        reason: 'Emails feature flag is disabled.',
      });

      return;
    }

    const poller = await this.startEmailPoller({
      ...msg,
      senderAddress: this.options.defaultFromEmail,
    });

    this.checkAndThrowIfPollerNotStarted(poller);

    await this.loopWhileNotDone(poller);

    const result = poller.getResult();

    this.validateResult(result);
  }

  private async startEmailPoller(msg: EmailMessage): Promise<Poller> {
    try {
      const poller = await this.emailClient.beginSend(msg);
      return poller;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private validateResult(result: EmailSendResponse | undefined): void {
    if (!result) {
      throw new PollerNoResultException();
    }
    if (result.status === KnownEmailSendStatus.Succeeded) {
      this.logger.debug(`Successfully sent the email (operation id: ${result.id})`);
    } else {
      this.logger.error(result.error);
      throw result.error;
    }
  }

  private async loopWhileNotDone(poller: Poller): Promise<void> {
    while (!poller.isDone()) {
      poller.poll();
      await delay(this.options.pollerWaitTimeInMs);
    }
  }

  private checkAndThrowIfPollerNotStarted(poller: Poller): void {
    if (!poller.getOperationState().isStarted) {
      throw new PollerNotStartedException();
    }
  }
}
