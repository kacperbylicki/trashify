/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const mailingProtobufPackage = 'mailing';

export interface SendEmailRequest {
  email: Email | undefined;
}

export interface SendEmailResponse {
  ok: boolean;
}

export interface Email {
  content: EmailContent | undefined;
  recipients: EmailRecipients | undefined;
  senderAddress: string;
  disableUserEngagementTracking: boolean;
  replyTo: EmailAddress[];
  attachments: EmailAttachment[];
  headers: { [key: string]: string };
}

export interface Email_HeadersEntry {
  key: string;
  value: string;
}

export interface EmailContent {
  subject: string;
  html?: string | undefined;
  plainText?: string | undefined;
}

export interface EmailRecipients {
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
}

export interface EmailAddress {
  address: string;
  displayName?: string | undefined;
}

export interface EmailAttachment {
  contentInBase64: string;
  contentType: string;
  name: string;
}

export const MAILING_PACKAGE_NAME = 'mailing';

export abstract class MailingServiceClient {
  abstract sendEmail(
    request: SendEmailRequest,
  ): Promise<SendEmailResponse> | Observable<SendEmailResponse> | SendEmailResponse;
}

export interface MailingServiceController {
  sendEmail(
    request: SendEmailRequest,
  ): Promise<SendEmailResponse> | Observable<SendEmailResponse> | SendEmailResponse;
}

export function MailingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['sendEmail'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('MailingService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('MailingService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MAILING_SERVICE_NAME = 'MailingService';
