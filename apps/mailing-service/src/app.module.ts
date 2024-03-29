import { AppConfig, AzureConfig } from './config';
import { AzureMailerModule } from './modules';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ default: AppConfig, templates: [AppConfig, AzureConfig] }),
    // AzureIdentityProviderModule,
    AzureMailerModule.registerAsync({
      useFactory: () => {
        const { connectionString, fromEmail } = Config.getValues(AzureConfig);
        return {
          connectionString,
          defaultFromEmail: fromEmail,
        };
      },
      inject: [getConfigContainerToken(AzureConfig)],
    }),
  ],
})
export class AppModule {}
