import { From } from '@unifig/core';
import { IsInt, IsString } from 'class-validator';

export class AppConfig {
  @From('NODE_ENV')
  @IsString()
  nodeEnv!: string;

  @From('PORT')
  @IsInt()
  port!: number;

  // TODO: Uncomment this when redis service is running
  // @From('API_GATEWAY_REDIS_CACHE_HOST')
  // @IsString()
  // apiGatewayCacheHost!: string;

  // @From('API_GATEWAY_REDIS_CACHE_PORT')
  // @IsInt()
  // apiGatewayCachePort!: number;

  // @From('API_GATEWAY_REDIS_CACHE_PASSWORD')
  // @IsString()
  // apiGatewayCachePassword!: string;

  // @From('API_GATEWAY_REDIS_CACHE_TTL')
  // @IsInt()
  // apiGatewayCacheTTL!: number;

  @From('ACCOUNTS_SERVICE_URL')
  @IsString()
  accountServiceUrl!: string;

  @From('TRASH_SERVICE_URL')
  @IsString()
  trashServiceUrl!: string;

  @From('MAILING_SERVICE_URL')
  @IsString()
  mailingServiceUrl!: string;

  @From('API_GATEWAY_URL')
  @IsString()
  apiGatewayUrl!: string;

  @From({
    key: 'EMAILS_FEATURE_FLAG',
    default: false,
  })
  emailsFeatureFlag!: boolean;
}
