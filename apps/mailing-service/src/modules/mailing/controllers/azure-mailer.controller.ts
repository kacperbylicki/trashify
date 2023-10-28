import { AzureMailerService } from '../services/azure-mailer.service';
import { Controller, HttpStatus, Logger, Optional } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  MAILING_SERVICE_NAME,
  MailingServiceController,
  SendEmailResponse,
  mailingGrpcMethod,
} from '@trashify/transport';
import { SendEmailRequestDto } from '../dtos';
import { isMailerExceptionTypeGuard } from '../../../common/type-guards/is-mailer-exception.type-guard';

@Controller()
export class AzureMailerController implements MailingServiceController {
  constructor(
    private readonly azureMailerService: AzureMailerService,
    @Optional() private readonly logger: Logger,
  ) {
    if (!logger) {
      this.logger = new Logger(AzureMailerController.name);
    }
  }

  @GrpcMethod(MAILING_SERVICE_NAME, mailingGrpcMethod.sendEmail)
  async sendEmail(request: SendEmailRequestDto): Promise<SendEmailResponse> {
    try {
      const payload = {
        recipients: {
          to: request.recipients.to,
          cc: request.recipients.cc,
          bcc: request.recipients.bcc,
        },
        disableUserEngagementTracking: request.disableUserEngagementTracking,
        attachments: request.attachments,
      };

      if (request.content.html) {
        await this.azureMailerService.sendEmail({
          content: {
            subject: request.content.subject,
            html: request.content.html,
          },
          ...payload,
        });
      } else if (request.content.plainText) {
        await this.azureMailerService.sendEmail({
          content: {
            subject: request.content.subject,
            plainText: request.content.plainText,
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
