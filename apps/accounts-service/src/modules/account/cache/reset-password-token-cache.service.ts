import { Injectable } from '@nestjs/common';

type UserUUID = string;

interface CachedValue {
  ttl: number;
  value: UserUUID;
}

@Injectable()
export class ResetPasswordTokenCacheService {
  private readonly tokensCache: Map<string, CachedValue> = new Map();

  public get(key: string): string | null {
    const cache = this.tokensCache.get(key);

    if (!cache) {
      return null;
    }

    if (cache?.ttl <= new Date().getTime()) {
      return null;
    }

    return cache.value;
  }

  public set(key: string, value: CachedValue): void {
    this.tokensCache.set(key, value);
  }

  public clear(): void {
    this.tokensCache.clear();
  }

  public clearExpired(): void {
    const currentTime = new Date().getTime();

    const values = this.tokensCache.entries();

    for (const value of values) {
      const isExpired = value[1].ttl < currentTime;

      isExpired ? this.tokensCache.delete(value[0]) : null;
    }
  }
}
