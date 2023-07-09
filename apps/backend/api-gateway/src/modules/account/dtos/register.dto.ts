import { ApiProperty } from '@nestjs/swagger';
import { RegisterRequest, RegisterResponse } from '@trashify/transport';

export class RegisterRequestDto implements RegisterRequest {
  @ApiProperty({ type: String, format: 'email' })
  public email!: string;

  @ApiProperty({ type: String, example: `johndoe` })
  public username!: string;

  @ApiProperty({ type: String, format: 'password' })
  public password!: string;

  @ApiProperty({ type: String, format: 'password' })
  public confirmPassword!: string;
}

export class RegisterResponseDto implements RegisterResponse {
  @ApiProperty({ type: Number, example: 201 })
  status!: number;

  @ApiProperty({ type: [String], example: ['something went wrong'] })
  error?: string[];
}
