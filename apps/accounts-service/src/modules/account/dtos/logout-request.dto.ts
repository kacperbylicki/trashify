import { IsNotEmpty, IsUUID } from 'class-validator';
import { LogoutRequest } from '@trashify/transport';

export class LogoutRequestDto implements LogoutRequest {
  @IsUUID()
  @IsNotEmpty()
  accountId!: string;
}
