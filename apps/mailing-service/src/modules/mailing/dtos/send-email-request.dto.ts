import { EmailDto } from './email.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class SendEmailRequestDto {
  @ValidateNested()
  @Type(() => EmailDto)
  email!: EmailDto;
}
