import { IsNotEmpty, IsString } from 'class-validator';
import { LoginRequest } from '@trashify/transport';

export class LoginRequestDto implements LoginRequest {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
