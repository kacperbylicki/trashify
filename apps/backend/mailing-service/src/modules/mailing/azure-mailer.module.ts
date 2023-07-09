import { AzureMailerService } from './azure-mailer.service';
import { ConfigurableAzureMailerModule } from './configurable-azure-mailer.module';
import { Module } from '@nestjs/common';

@Module({
  providers: [AzureMailerService],
  exports: [AzureMailerService],
})
export class AzureMailerModule extends ConfigurableAzureMailerModule {}
