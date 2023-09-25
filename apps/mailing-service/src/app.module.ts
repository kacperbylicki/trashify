import { AppConfig, AzureConfig } from './config';
import { AzureIdentityProviderModule } from './modules';
import { ConfigModule } from '@unifig/nest';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ default: AppConfig, templates: [AppConfig, AzureConfig] }),
    AzureIdentityProviderModule,
    // AzureMailerModule.registerAsync({
    //   useFactory: () => {
    //     const { connectionString, fromEmail } = Config.getValues(AzureConfig);
    //     return {
    //       connectionString,
    //       defaultFromEmail: fromEmail,
    //     };
    //   },
    //   inject: [AzureIdentityProvider, getConfigContainerToken(AzureConfig)],
    // }),
  ],
})
export class AppModule {}
