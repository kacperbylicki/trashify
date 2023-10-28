import { EmailAddressDto } from './email-address.dto';
import { EmailRecipients } from '@trashify/transport';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailRecipientsDto implements EmailRecipients {
  @IsDefined()
  @ValidateNested({
    each: true,
    always: true,
  })
  @Type(() => EmailAddressDto)
  to!: EmailAddressDto[];

  @IsOptional()
  @ValidateNested({
    each: true,
  })
  @Type(() => EmailAddressDto)
  cc!: EmailAddressDto[];

  @IsOptional()
  @ValidateNested({
    each: true,
  })
  @Type(() => EmailAddressDto)
  bcc!: EmailAddressDto[];
}
