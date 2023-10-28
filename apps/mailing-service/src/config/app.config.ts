import { From } from '@unifig/core';
import { IsBoolean, IsString } from 'class-validator';

export class AppConfig {
  @From('NODE_ENV')
  @IsString()
  nodeEnv!: string;

  @From('MAILING_SERVICE_URL')
  @IsString()
  serviceUrl!: string;

  @From({
    key: 'EMAILS_FEATURE_FLAG',
    default: false,
  })
  @IsBoolean()
  emailsFeatureFlag!: boolean;
}
