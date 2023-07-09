import { AccountConstraints } from '../enums';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegisterRequest } from '@trashify/transport';

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(AccountConstraints.UsernameMinLength)
  @MaxLength(AccountConstraints.UsernameMaxLength)
  public username!: string;

  @IsString()
  @MinLength(AccountConstraints.PasswordMinLength)
  @MaxLength(AccountConstraints.PasswordMaxLength)
  public password!: string;

  @IsString()
  @MinLength(AccountConstraints.PasswordMinLength)
  @MaxLength(AccountConstraints.PasswordMaxLength)
  public confirmPassword!: string;
}
