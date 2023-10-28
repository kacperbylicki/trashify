import { EmailAddressDto } from './email-address.dto';
import { EmailAttachmentsDto } from './email-attachment.dto';
import { EmailContentDto } from './email-content.dto';
import { EmailRecipientsDto } from './email-recipients.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { SendEmailRequest } from '@trashify/transport';
import { Type } from 'class-transformer';

export class SendEmailRequestDto implements SendEmailRequest {
  @ValidateNested({
    each: true,
  })
  @Type(() => EmailContentDto)
  content!: EmailContentDto;

  @ValidateNested({
    each: true,
  })
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => EmailRecipientsDto)
  recipients!: EmailRecipientsDto;

  @IsBoolean()
  @IsNotEmpty()
  disableUserEngagementTracking!: boolean;

  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @Type(() => EmailAddressDto)
  replyTo!: EmailAddressDto[];

  @IsOptional()
  @ValidateNested({
    each: true,
  })
  @Type(() => EmailAttachmentsDto)
  attachments!: EmailAttachmentsDto[];
}
