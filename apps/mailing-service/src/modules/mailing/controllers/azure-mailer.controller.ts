import { AzureMailerService } from '../services/azure-mailer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import {
  MAILING_SERVICE_NAME,
  MailingServiceController,
  SendEmailResponse,
} from '@trashify/transport';
import { SendEmailRequestDto } from '../dtos';

@Injectable()
export class AzureMailerController implements MailingServiceController {
  constructor(private readonly azureMailerService: AzureMailerService) {}

  @GrpcMethod(MAILING_SERVICE_NAME, 'SendEmail')
  async sendEmail(request: SendEmailRequestDto): Promise<SendEmailResponse> {
    try {
      const payload = {
        recipients: {
          to: request.email.recipients.to,
          cc: request.email.recipients.cc,
          bcc: request.email.recipients.bcc,
        },
        senderAddress: request.email.senderAddress,
        disableUserEngagementTracking: request.email.disableUserEngagementTracking,
        replyTo: request.email.replyTo,
        attachments: request.email.attachments,
        headers: request.email.headers,
      };

      if (request.email.content.html) {
        await this.azureMailerService.sendEmail({
          content: {
            subject: request.email.content.subject,
            html: request.email.content.html,
          },
          ...payload,
        });
      } else if (request.email.content.plainText) {
        await this.azureMailerService.sendEmail({
          content: {
            subject: request.email.content.subject,
            plainText: request.email.content.plainText,
          },
          ...payload,
        });
      }

      return {
        ok: true,
      };
    } catch (error) {
      return {
        // TODO: Update protobuf to return an optional error object
        ok: false,
      };
    }
  }
}
