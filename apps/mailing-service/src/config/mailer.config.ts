import { AvailableMailers } from '../modules';
import { From } from '@unifig/core';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class MailerConfig {
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
