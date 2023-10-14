import { Injectable } from '@nestjs/common';
import { ResetPasswordTokenRepository } from '../repositories';

@Injectable()
export class ResetPasswordTokenCacheService {
  public constructor(private readonly resetPasswordTokenRepository: ResetPasswordTokenRepository) {}

  public async get(key: string): Promise<string | null> {
    const resetPasswordToken = await this.resetPasswordTokenRepository.findByToken(key);

    // TODO: Reduce to single DB operation :)

    if (!resetPasswordToken) {
      return null;
    }

    await this.resetPasswordTokenRepository.delete(resetPasswordToken.accountUuid);

    return resetPasswordToken.accountUuid;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.resetPasswordTokenRepository.save({
      token: key,
      accountUuid: value,
    });
  }
}
