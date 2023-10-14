import { From } from '@unifig/core';
import { IsEmail, IsUrl } from 'class-validator';

export class AzureConfig {
  @From('AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING')
  @IsUrl()
  connectionString!: string;

  @From('AZURE_COMMUNICATION_SERVICES_FROM_EMAIL')
  @IsEmail()
  fromEmail!: string;
}
