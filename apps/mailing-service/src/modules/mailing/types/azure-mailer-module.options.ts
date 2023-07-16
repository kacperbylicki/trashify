import { EmailClientOptions } from '@azure/communication-email';

export type AzureMailerModuleOptions = {
  connectionString: string;
  defaultFromEmail: string;
  pollerWaitTimeInMs?: number;
  clientOptions?: EmailClientOptions;
};
