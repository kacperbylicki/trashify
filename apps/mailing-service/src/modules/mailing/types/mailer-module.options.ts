export type MailerModuleOptions = AwsSESOptions;

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
