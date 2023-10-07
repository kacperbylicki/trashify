import { ChangeEmailRequest } from '@trashify/transport';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeEmailRequestDto implements ChangeEmailRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsUUID()
  uuid!: string;
}
