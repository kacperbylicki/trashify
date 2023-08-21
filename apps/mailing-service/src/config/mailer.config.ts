import { AvailableMailers } from '../modules';
import { From } from '@unifig/core';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class MailerConfig {
  @From('MAILER_TYPE')
  @IsEnum(AvailableMailers, {
    always: true,
  })
  type!: AvailableMailers;

  @From('AWS_SES_REGION')
  @IsString()
  @IsNotEmpty()
  awsSesRegion!: string;

  @From('AWS_SES_CLIENT_ID')
  @IsString()
  @IsNotEmpty()
  awsSESClientId!: string;

  @From('AWS_SES_SECRET_KEY')
  @IsString()
  @IsNotEmpty()
  awsSesSecretKey!: string;
}
