import { CreateResetPasswordTokenRequest } from '@trashify/transport';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResetPasswordTokenRequestDto implements CreateResetPasswordTokenRequest {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
