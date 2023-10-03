import { AzureMailerService } from '../services/azure-mailer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { HttpStatus, Injectable, Logger, Optional } from '@nestjs/common';
import {
  MAILING_SERVICE_NAME,
  MailingServiceController,
  SendEmailResponse,
  mailingGrpcMethods,
} from '@trashify/transport';
import { SendEmailRequestDto } from '../dtos';
import { isMailerExceptionTypeGuard } from '../../../common/type-guards/is-mailer-exception.type-guard';

@Injectable()
export class AzureMailerController implements MailingServiceController {
  constructor(
    private readonly azureMailerService: AzureMailerService,
    @Optional() private readonly logger: Logger,
  ) {
    if (!logger) {
      this.logger = new Logger(AzureMailerController.name);
    }
  }

  @GrpcMethod(MAILING_SERVICE_NAME, mailingGrpcMethods.sendEmail)
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
      return this.handleMailerException(error);
    }
  }

  private handleMailerException(exception: unknown): SendEmailResponse {
    if (isMailerExceptionTypeGuard(exception)) {
      this.logger.error(exception.message, exception.details);
      return {
        ok: false,
        mailingError: {
          message: exception.message,
          statusCode: Number.isSafeInteger(Number(exception.code))
            ? Number(exception.code)
            : undefined,
        },
      };
    }
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      return {
        ok: false,
        mailingError: {
          message: exception.message,
          statusCode: undefined,
        },
      };
    }

    if (exception instanceof TypeError) {
      this.logger.error(exception.message, exception.stack);
      return {
        ok: false,
        mailingError: {
          message: exception.message,
          statusCode: HttpStatus.BAD_REQUEST,
        },
      };
    }

    this.logger.error(exception);

    return {
      ok: false,
    };
  }
}
