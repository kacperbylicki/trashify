import { GetAccountRequest } from '@trashify/transport';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAccountRequestDto implements GetAccountRequest {
  @IsUUID()
  @IsNotEmpty()
  accountId!: string;
}
