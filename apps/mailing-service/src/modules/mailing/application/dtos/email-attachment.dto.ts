import { EmailAttachment } from '@trashify/transport';
import { IsBase64, IsMimeType, IsNotEmpty, IsString } from 'class-validator';

export class EmailAttachmentsDto implements EmailAttachment {
  @IsNotEmpty()
  @IsBase64()
  contentInBase64!: string;

  @IsNotEmpty()
  @IsMimeType()
  contentType!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
