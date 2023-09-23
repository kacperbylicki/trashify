import { From } from '@unifig/core';
import { IsInt, IsString } from 'class-validator';

export class AppConfig {
  @From('NODE_ENV')
  @IsString()
  nodeEnv!: string;

  @From('PROTO_PATH')
  @IsString()
  protoPath!: string;

  @From('PORT')
  @IsInt()
  port!: number;

  @From('API_GATEWAY_REDIS_CACHE_HOST')
  @IsString()
  apiGatewayCacheHost!: string;

  @From('API_GATEWAY_REDIS_CACHE_PORT')
  @IsInt()
  apiGatewayCachePort!: number;

  @From('API_GATEWAY_REDIS_CACHE_PASSWORD')
  @IsString()
  apiGatewayCachePassword!: string;

  @From('API_GATEWAY_REDIS_CACHE_TTL')
  @IsInt()
  apiGatewayCacheTTL!: number;

  @From('ACCOUNTS_SERVICE_URL')
  @IsString()
  accountServiceUrl!: string;
}
