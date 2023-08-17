import { AppConfig, MailerConfig } from './config';
import { ConfigModule } from '@unifig/nest';
import { MailerModule } from './modules/mailing/mailer.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ default: AppConfig, templates: [AppConfig, MailerConfig] }),
    MailerModule,
  ],
})
export class AppModule {}
