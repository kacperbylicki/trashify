import { ApiProperty } from '@nestjs/swagger';
import {
  CreateResetPasswordTokenRequest,
  CreateResetPasswordTokenResponse,
} from '@trashify/transport';

export class ResetPasswordDto implements CreateResetPasswordTokenRequest {
  @ApiProperty({
    type: 'string',
    description: 'New user email.',
    example: 'paweł.wadowice@jan.pl',
  })
  email!: string;
}

export class ResetPasswordResponseDto
  implements Omit<CreateResetPasswordTokenResponse, 'token' | 'error'>
{
  @ApiProperty({ type: Number, example: 200 })
  status!: number;
  token?: string | undefined;
  error?: string[] | undefined;
}
