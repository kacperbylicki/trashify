import { AccountConstraints } from '../enums';
import { ChangePasswordRequest } from '@trashify/transport';
import { IsJWT, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordRequestDto implements ChangePasswordRequest {
  @IsJWT()
  @IsNotEmpty()
  token!: string;

  @IsNotEmpty()
  @MinLength(AccountConstraints.PasswordMinLength)
  @MaxLength(AccountConstraints.PasswordMaxLength)
  password!: string;

  @IsString()
  @MinLength(AccountConstraints.PasswordMinLength)
  @MaxLength(AccountConstraints.PasswordMaxLength)
  repeatedPassword!: string;
}
