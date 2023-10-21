import { ApiProperty } from '@nestjs/swagger';
import { ChangePasswordRequest, ChangePasswordResponse } from '@trashify/transport';

export class ChangePasswordDto implements Omit<ChangePasswordRequest, 'token'> {
  @ApiProperty({
    type: String,
    description: 'New account password.',
    example: 'such-Sec&re-Much-kREmowo-912-some71ng',
  })
  password!: string;

  @ApiProperty({
    type: String,
    description: 'Repeated account password.',
    example: 'such-Sec&re-Much-kREmowo-912-some71ng',
  })
  repeatedPassword!: string;
}

export class ChangePasswordResponseDto implements ChangePasswordResponse {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error?: string[];
}
