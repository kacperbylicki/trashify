import {
  AccountServiceClient,
  ValidateJwtRequest,
  ValidateJwtResponse,
  ValidateRefreshJwtRequest,
  ValidateRefreshJwtResponse,
} from '@trashify/transport';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtService {
  public constructor(private readonly client: AccountServiceClient) {}

  async validate(payload: ValidateJwtRequest): Promise<ValidateJwtResponse> {
    return firstValueFrom(this.client.validateJwt(payload));
  }

  async validateRefreshToken(
    payload: ValidateRefreshJwtRequest,
  ): Promise<ValidateRefreshJwtResponse> {
    return firstValueFrom(this.client.validateRefreshJwt(payload));
  }
}
