import { IsJWT, IsNotEmpty } from 'class-validator';
import { ValidateRefreshJwtRequest } from '@trashify/transport';

export class ValidateRefreshJwtRequestDto implements ValidateRefreshJwtRequest {
  @IsJWT()
  @IsNotEmpty()
  refreshToken!: string;
}
