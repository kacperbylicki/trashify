import { ApiProperty } from '@nestjs/swagger';
import { ConfirmRegistrationRequest, ConfirmRegistrationResponse } from '@trashify/transport';

export class ConfirmRegistrationRequestDto implements ConfirmRegistrationRequest {
  @ApiProperty({
    type: 'uuid',
  })
  uuid!: string;
}

export class ConfirmRegistrationResponseDto implements ConfirmRegistrationResponse {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error!: string[];
}
