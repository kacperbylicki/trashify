import { ApiProperty } from '@nestjs/swagger';
import { ConfirmNewEmailRequest, ConfirmNewEmailResponse } from '@trashify/transport';

export class ConfirmNewEmailRequestDto implements ConfirmNewEmailRequest {
  @ApiProperty({
    description: 'Email confirmation token.',
    type: 'jwt',
  })
  token!: string;
}

export class ConfirmNewEmailResponseDto implements ConfirmNewEmailResponse {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error!: string[];
}
