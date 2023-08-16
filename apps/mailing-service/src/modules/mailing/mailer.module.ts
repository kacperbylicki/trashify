import { ConfigurableAzureMailerModule } from './configurable-mailer.module';
import { MailerClientFactory } from './mailer-client-factory';
import { MailerController } from './controllers';
import { MailerModuleOptions } from './types';
import { MailerService } from './services/mailer-service';
import { MailerServiceFactory } from './mailer-service-factory';
import { Module } from '@nestjs/common';
import { symbols } from './symbols';

@Module({
  providers: [
    {
      provide: symbols.mailerClient,
      useFactory: (mailerConfig: MailerModuleOptions): unknown => {
        const mailerClientFactory = new MailerClientFactory(mailerConfig);

        return mailerClientFactory.create();
      },
      inject: [symbols.mailerModuleConfig],
    },
    {
      provide: symbols.mailerService,
      useFactory: (mailerConfig, mailerClient): MailerService => {
        const mailerServiceFactory = new MailerServiceFactory(mailerClient, mailerConfig);

        return mailerServiceFactory.create();
      },
      inject: [symbols.mailerModuleConfig, symbols.mailerClient],
    },
  ],
  controllers: [MailerController],
  exports: [symbols.mailerService],
})
export class MailerModule extends ConfigurableAzureMailerModule {}
