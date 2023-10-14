import { EmailConfirmationTokenRepository } from '../repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailConfirmationTokenCacheService {
  public constructor(
    private readonly emailConfirmationTokenRepository: EmailConfirmationTokenRepository,
  ) {}

  public async get(key: string): Promise<string | null> {
    const resetPasswordToken = await this.emailConfirmationTokenRepository.findByToken(key);

    // TODO: Reduce to single DB operation :)

    if (!resetPasswordToken) {
      return null;
    }

    await this.emailConfirmationTokenRepository.delete(resetPasswordToken.accountUuid);

    return resetPasswordToken.accountUuid;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.emailConfirmationTokenRepository.save({
      token: key,
      accountUuid: value,
    });
  }
}
