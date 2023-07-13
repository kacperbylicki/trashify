import { EmailContent } from '@trashify/transport';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class EmailContentDto implements EmailContent {
  @IsNotEmpty()
  @IsString()
  subject!: string;

  @ValidateIf((o) => o.plainText === undefined)
  @IsNotEmpty()
  @IsString()
  html?: string | undefined;

  @ValidateIf((o) => o.html === undefined)
  @IsNotEmpty()
  @IsString()
  plainText?: string | undefined;
}
