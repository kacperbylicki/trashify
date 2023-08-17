import { EmailAddressDto } from './email-address.dto';
import { EmailRecipients } from '@trashify/transport';
import { IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailRecipientsDto implements EmailRecipients {
  @IsArray({
    each: true,
  })
  @Type(() => EmailAddressDto)
  to!: EmailAddressDto[];

  @IsArray({
    each: true,
  })
  @Type(() => EmailAddressDto)
  @IsOptional()
  cc!: EmailAddressDto[];

  @IsArray({
    each: true,
  })
  @Type(() => EmailAddressDto)
  @IsOptional()
  bcc!: EmailAddressDto[];
}
