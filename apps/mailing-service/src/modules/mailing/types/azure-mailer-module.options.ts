import { EmailClientOptions } from '@azure/communication-email';

export type AzureMailerModuleOptions = {
  connectionString: string;
  defaultFromEmail: string;
  poolerWaitTimeInMs?: number;
  clientOptions?: EmailClientOptions;
};
