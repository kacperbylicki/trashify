import { GrpcMethod } from '@nestjs/microservices';
import { HttpStatus, Inject, Injectable, Logger, Optional } from '@nestjs/common';
import {
  MAILING_SERVICE_NAME,
  MailingServiceController,
  SendEmailResponse,
} from '@trashify/transport';
import { MailerService } from '../../application/services/mailer-service';
import { SendEmailRequestDto } from '../../application/dtos';
import { isMailerExceptionTypeGuard } from '../../../../common/type-guards/is-mailer-exception.type-guard';
import { symbols } from '../../symbols';

@Injectable()
export class MailerController implements MailingServiceController {
  constructor(
    @Inject(symbols.mailerService)
    private readonly mailerService: MailerService,
    @Optional() private readonly logger: Logger,
  ) {
    if (!logger) {
      this.logger = new Logger(MailerController.name);
    }
  }

  @GrpcMethod(MAILING_SERVICE_NAME, 'SendEmail')
  async sendEmail(request: SendEmailRequestDto): Promise<SendEmailResponse> {
    try {
      await this.mailerService.sendEmail(request.email);

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
