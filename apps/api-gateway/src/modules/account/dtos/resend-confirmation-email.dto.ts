import { ApiProperty } from '@nestjs/swagger';
import { ResendRegistrationConfirmationEmailRequest } from '@trashify/transport';

export class ResendRegistrationConfirmationEmailRequestDto
  implements ResendRegistrationConfirmationEmailRequest
{
  @ApiProperty({ type: String, format: 'email' })
  email!: string;
}

export class ResendRegistrationConfirmationEmailResponseDto {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error!: string[];
}
