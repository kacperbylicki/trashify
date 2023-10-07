import { ApiProperty } from '@nestjs/swagger';
import { ChangeUsernameRequest, ChangeUsernameResponse } from '@trashify/transport';

export class ChangeUsernameDto implements Omit<ChangeUsernameRequest, 'uuid'> {
  @ApiProperty({
    type: String,
    description: 'New account username',
    example: 'Jan Pawłowicz Trzeci',
  })
  username!: string;
}

export class ChangeUsernameResponseDto implements ChangeUsernameResponse {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({
    type: String,
    description: 'New account username',
    example: 'Jan Pawłowicz Trzeci',
  })
  username!: string;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error?: string[] | undefined;
}
