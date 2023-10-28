import { IsEmail, IsNotEmpty } from 'class-validator';
import { ResendRegistrationConfirmationEmailRequest } from '@trashify/transport';

export class ResendRegistrationEmailRequestDto
  implements ResendRegistrationConfirmationEmailRequest
{
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
