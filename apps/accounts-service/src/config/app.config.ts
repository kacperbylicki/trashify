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

  @From('ACCOUNTS_SERVICE_HOST')
  @IsString()
  host!: string;
}
