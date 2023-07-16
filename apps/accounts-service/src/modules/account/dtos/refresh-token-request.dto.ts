import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RefreshTokenRequest } from '@trashify/transport';

export class RefreshTokenRequestDto implements RefreshTokenRequest {
  @IsUUID()
  @IsNotEmpty()
  accountId!: string;

  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
