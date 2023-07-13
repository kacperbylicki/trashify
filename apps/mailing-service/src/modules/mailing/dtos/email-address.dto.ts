import { EmailAddress } from '@trashify/transport';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailAddressDto implements EmailAddress {
  @IsNotEmpty()
  @IsEmail()
  address!: string;

  @IsOptional()
  @IsString()
  displayName?: string | undefined;
}
