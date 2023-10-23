import { EmailConfirmationTokenRepository } from '../repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailConfirmationTokenCacheService {
  public constructor(
    private readonly emailConfirmationTokenRepository: EmailConfirmationTokenRepository,
  ) {}

  public async get(key: string): Promise<string | null> {
    const emailConfirmationToken = await this.emailConfirmationTokenRepository.findByToken(key);

    // TODO: Reduce to single DB operation :)

    if (!emailConfirmationToken) {
      return null;
    }

    return emailConfirmationToken.accountUuid;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.emailConfirmationTokenRepository.save({
      token: key,
      accountUuid: value,
    });
  }

  public async delete(key: string): Promise<void> {
    await this.emailConfirmationTokenRepository.delete(key);
  }
}
