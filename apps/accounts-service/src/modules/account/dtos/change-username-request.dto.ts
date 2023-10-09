import { AccountConstraints } from '../enums';
import { ChangeUsernameRequest } from '@trashify/transport';
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ChangeUsernameRequestDto implements ChangeUsernameRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(AccountConstraints.UsernameMinLength)
  @MaxLength(AccountConstraints.UsernameMaxLength)
  username!: string;

  @IsNotEmpty()
  @IsUUID()
  uuid!: string;
}
