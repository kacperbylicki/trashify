import { AzureMailerController } from './controllers';
import { AzureMailerService } from './services';
import { ConfigurableAzureMailerModule } from './configurable-azure-mailer.module';
import { Module } from '@nestjs/common';

@Module({
  providers: [AzureMailerService],
  controllers: [AzureMailerController],
  exports: [AzureMailerService],
})
export class AzureMailerModule extends ConfigurableAzureMailerModule {}
