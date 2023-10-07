import { ChangeUsernameRequest } from '@trashify/transport';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class ChangeUsernameRequestDto implements ChangeUsernameRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username!: string;

  @IsNotEmpty()
  @IsUUID()
  uuid!: string;
}
