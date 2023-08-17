import { MailerController } from './presentation';
import { Module } from '@nestjs/common';
import { nestMailerClientFactoryProvider } from './infrastructure';
import { nestMailerModuleOptionsFactory } from './infrastructure/config';
import { nestMailerServiceFactoryProvider } from './infrastructure/services/mailer/nest-mailer-service-factory-provider';
import { symbols } from './symbols';

@Module({
  providers: [
    nestMailerModuleOptionsFactory,
    nestMailerClientFactoryProvider,
    nestMailerServiceFactoryProvider,
  ],
  controllers: [MailerController],
  exports: [symbols.mailerService],
})
export class MailerModule {}
