import { Email, EmailAddress } from '@trashify/transport';
import { MailerService } from '../mailer-service';
import { SESv2Client, SendEmailCommand, SendEmailRequest } from '@aws-sdk/client-sesv2';

export class AwsSESMailerService implements MailerService {
  public constructor(private readonly sesClient: SESv2Client) {}

  public async sendEmail(payload: Email): Promise<void> {
    const commandPayload = this.prepareCommandPayload(payload);

    const command = new SendEmailCommand(commandPayload);

    await this.sesClient.send(command);
  }

  private prepareCommandPayload(payload: Email): SendEmailRequest {
    const commandPayload = {
      FromEmailAddress: payload.senderAddress,
      Destination: {
        ToAddresses: payload.recipients?.to.map(this.extractStringAddress),
        CcAddresses: payload.recipients?.cc.map(this.extractStringAddress),
        BccAddresses: payload.recipients?.bcc.map(this.extractStringAddress),
      },
      ReplyToAddresses: payload.replyTo.map(this.extractStringAddress),
      Content: {
        Simple: {
          Subject: {
            Data: payload.content?.subject,
            Charset: 'utf-8',
          },
          Body: {},
        },
      },
    };

    if (payload.content?.html) {
      commandPayload.Content.Simple.Body = {
        Html: {
          Data: payload.content.html,
          Charset: 'utf-8',
        },
      };
    }

    if (payload.content?.plainText) {
      commandPayload.Content.Simple.Body = {
        Text: {
          Data: payload.content.plainText,
          Charset: 'utf-8',
        },
      };
    }

    return commandPayload;
  }

  private extractStringAddress(emailAddress: EmailAddress): string {
    return emailAddress.address;
  }
}
