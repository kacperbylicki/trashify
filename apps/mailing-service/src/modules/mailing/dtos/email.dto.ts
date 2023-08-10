import { Email } from '@trashify/transport';
import { EmailAddressDto } from './email-address.dto';
import { EmailAttachmentsDto } from './email-attachment.dto';
import { EmailContentDto } from './email-content.dto';
import { EmailHeadersDto } from './email-headers.dto';
import { EmailRecipientsDto } from './email-recipients.dto';
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailDto implements Email {
  @ValidateNested({
    always: true,
  })
  @Type(() => EmailContentDto)
  content!: EmailContentDto;

  @ValidateNested({
    always: true,
  })
  @Type(() => EmailRecipientsDto)
  recipients!: EmailRecipientsDto;

  @IsNotEmpty()
  @IsEmail()
  senderAddress!: string;

  @IsBoolean()
  @IsNotEmpty()
  disableUserEngagementTracking!: boolean;

  @IsArray({
    each: true,
  })
  @Type(() => EmailAddressDto)
  replyTo!: EmailAddressDto[];

  @IsArray({
    each: true,
  })
  @Type(() => EmailAttachmentsDto)
  attachments!: EmailAttachmentsDto[];

  @Type(() => EmailHeadersDto)
  @ValidateNested()
  headers!: EmailHeadersDto;
}
