import { AwsSESOptions } from '../../../types';
import { FactoryLike } from '../../../../../common/types/factory-like';
import { Injectable } from '@nestjs/common';
import { SESv2Client } from '@aws-sdk/client-sesv2';

@Injectable()
export class AwsSESClientFactory implements FactoryLike<SESv2Client> {
  constructor(private readonly mailerModuleConfig: AwsSESOptions) {}

  create(): SESv2Client {
    return new SESv2Client({
      region: this.mailerModuleConfig.region,
      credentials: {
        accessKeyId: this.mailerModuleConfig.accessKeyId,
        secretAccessKey: this.mailerModuleConfig.secretAccessKey,
      },
    });
  }
}
