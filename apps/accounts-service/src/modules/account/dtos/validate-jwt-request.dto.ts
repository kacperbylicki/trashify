import { IsJWT, IsNotEmpty } from 'class-validator';
import { ValidateJwtRequest } from '@trashify/transport';

export class ValidateJwtRequestDto implements ValidateJwtRequest {
  @IsJWT()
  @IsNotEmpty()
  accessToken!: string;
}
