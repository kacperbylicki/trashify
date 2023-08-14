import { Account, GetAccountResponse } from '@trashify/transport';
import { ApiProperty } from '@nestjs/swagger';

export class AccountDto implements Account {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  uuid!: string;

  @ApiProperty({ type: String, format: 'email' })
  email!: string;

  @ApiProperty({ type: String, example: 'johndoe' })
  username!: string;
}

export class GetAccountResponseDto implements GetAccountResponse {
  @ApiProperty({ type: Number, example: 200 })
  status!: number;

  @ApiProperty({ type: [String], example: ['unauthorized'] })
  error?: string[];

  @ApiProperty({ type: () => AccountDto })
  data?: AccountDto | null;
}
