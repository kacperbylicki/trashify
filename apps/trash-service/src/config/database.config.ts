import { From } from '@unifig/core';
import { IsString } from 'class-validator';

export class DatabaseConfig {
  @From('MONGODB_TRASH_URI')
  @IsString()
  uri!: string;
}
