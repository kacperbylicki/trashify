import { AppConfig } from '../../config';
import { AzureMailerController } from './controllers';
import { AzureMailerService } from './services';
import { Config } from '@unifig/core';
import { ConfigurableAzureMailerModule } from './configurable-azure-mailer.module';
import { EMAILS_FEATURE_FLAG } from './symbols';
import { Module } from '@nestjs/common';
import { getConfigContainerToken } from '@unifig/nest';

@Module({
  providers: [
    AzureMailerService,
    {
      provide: EMAILS_FEATURE_FLAG,
      useFactory: (): boolean => {
        const { emailsFeatureFlag } = Config.getValues(AppConfig);

        return emailsFeatureFlag;
      },
      inject: [getConfigContainerToken(AppConfig)],
    },
  ],
  controllers: [AzureMailerController],
  exports: [AzureMailerService],
})
export class AzureMailerModule extends ConfigurableAzureMailerModule {}
