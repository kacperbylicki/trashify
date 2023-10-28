import { From } from '@unifig/core';
import { IsString } from 'class-validator';

export class AppConfig {
  @From('NODE_ENV')
  @IsString()
  nodeEnv!: string;

  @From('ACCOUNTS_SERVICE_URL')
  @IsString()
  serviceUrl!: string;

  @From({
    key: 'EMAIL_VERIFICATION_FEATURE_FLAG',
    default: false,
  })
  emailVerificationFeatureFlag!: boolean;
}
