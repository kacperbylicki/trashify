export type MailerModuleOptions = AwsSESOptions;

export enum AvailableMailers {
  SES = 'SES',
}

export type AwsSESOptions = {
  type: AvailableMailers.SES;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};
