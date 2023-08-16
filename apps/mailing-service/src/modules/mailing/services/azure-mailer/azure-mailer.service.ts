import { AzureMailerOptions, Poller } from '../../types';
import { Email } from '@trashify/transport';
import {
  EmailClient,
  EmailContent,
  EmailMessage,
  EmailSendResponse,
  KnownEmailSendStatus,
} from '@azure/communication-email';
import { Logger } from '@nestjs/common';
import { MailerService } from '../mailer-service';
import { PollerNoResultException, PollerNotStartedException } from '../../exception';
import { delay } from '../../../../common/util';

export class AzureMailerService implements MailerService {
  private readonly logger: Logger;

  constructor(
    private readonly options: AzureMailerOptions,
    private emailClient: EmailClient,
    logger?: Logger,
  ) {
    if (!logger) {
      this.logger = new Logger(AzureMailerService.name);
      return;
    }

    this.logger = logger;
  }

  async sendEmail(msg: Email): Promise<void> {
    const payload = this.preparePayload(msg);
    const poller = await this.startEmailPoller({
      ...payload,
      senderAddress: payload.senderAddress ?? this.options.defaultFromEmail,
    });

    this.checkAndThrowIfPollerNotStarted(poller);

    await this.loopWhileNotDone(poller);

    const result = poller.getResult();

    this.validateResult(result);
  }

  private preparePayload(payload: Email): EmailMessage {
    const email = {
      recipients: {
        to: payload.recipients?.to,
        cc: payload.recipients?.cc,
        bcc: payload.recipients?.bcc,
      },
      senderAddress: payload.senderAddress,
      disableUserEngagementTracking: payload.disableUserEngagementTracking,
      replyTo: payload.replyTo,
      attachments: payload.attachments,
      headers: payload.headers,
      content: {} as EmailContent,
    };

    if (payload.content?.html) {
      email.content = {
        subject: payload.content.subject,
        html: payload.content.html,
      };
    }

    if (payload.content?.plainText) {
      email.content = {
        subject: payload.content.subject,
        plainText: payload.content.plainText,
      };
    }

    return email;
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
