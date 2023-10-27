import { ApiProperty } from '@nestjs/swagger';
import { ChangeEmailRequest, ChangeEmailResponse } from '@trashify/transport';

export class ChangeEmailDto implements Omit<ChangeEmailRequest, 'uuid'> {
  @ApiProperty({
    type: 'string',
    description: 'New user email.',
    example: 'paweł.wadowice@jan.pl',
  })
  email!: string;
}

export class ChangeEmailResponseDto implements ChangeEmailResponse {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({ type: String, description: 'New user email.' })
  email!: string;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error?: string[];
}
