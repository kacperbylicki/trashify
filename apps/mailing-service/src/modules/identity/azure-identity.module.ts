import { AzureIdentityProvider } from './azure-identity-provider.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AzureIdentityProvider],
  exports: [AzureIdentityProvider],
})
export class AzureIdentityProviderModule {}
