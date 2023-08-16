import { EmailClientOptions } from '@azure/communication-email';

export type MailerModuleOptions = AwsSESOptions | AzureMailerOptions;

export enum AvailableMailers {
  SES = 'SES',
  AZURE = 'AZURE',
}

export type AwsSESOptions = {
  type: AvailableMailers.SES;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type AzureMailerOptions = {
  type: AvailableMailers.AZURE;
  connectionString: string;
  defaultFromEmail: string;
  pollerWaitTimeInMs?: number;
  clientOptions?: EmailClientOptions;
};
