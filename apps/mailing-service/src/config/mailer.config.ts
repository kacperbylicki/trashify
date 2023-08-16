import { AvailableMailers } from '../modules';
import { From } from '@unifig/core';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl, ValidateIf } from 'class-validator';

export class MailerConfig {
  @From('AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING')
  @ValidateIf((instance: MailerConfig) => instance.type === AvailableMailers.AZURE)
  @IsUrl()
  connectionString!: string;

  @From('MAILER_FROM_EMAIL')
  @IsEmail()
  defaultFromEmail!: string;

  @From('AZURE_TENANT_ID')
  @ValidateIf((instance: MailerConfig) => instance.type === AvailableMailers.AZURE)
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @From('AZURE_CLIENT_ID')
  @ValidateIf((instance: MailerConfig) => instance.type === AvailableMailers.AZURE)
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @From('MAILER_TYPE')
  @IsEnum(AvailableMailers, {
    always: true,
  })
  type!: AvailableMailers;

  @From('AWS_SES_REGION')
  @ValidateIf((instance: MailerConfig) => instance.type === AvailableMailers.SES)
  @IsString()
  @IsNotEmpty()
  awsSesRegion!: string;

  @From('AWS_SES_CLIENT_ID')
  @ValidateIf((instance: MailerConfig) => instance.type === AvailableMailers.SES)
  @IsString()
  @IsNotEmpty()
  awsSESClientId!: string;

  @From('AWS_SES_SECRET_KEY')
  @ValidateIf((instance: MailerConfig) => instance.type === AvailableMailers.SES)
  @IsString()
  @IsNotEmpty()
  awsSesSecretKey!: string;
}
