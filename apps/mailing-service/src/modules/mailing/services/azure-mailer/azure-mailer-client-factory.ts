import { AzureIdentityProvider } from '../../../identity';
import { AzureMailerOptions } from '../../types';
import { EmailClient } from '@azure/communication-email';

export class AzureMailerClientFactory {
  public constructor(
    private readonly options: AzureMailerOptions,
    private readonly azureIdentityProvider?: AzureIdentityProvider,
  ) {}

  create(): EmailClient {
    if (this.azureIdentityProvider) {
      return new EmailClient(
        this.options.connectionString,
        this.azureIdentityProvider.azureCredential,
        this.options.clientOptions,
      );
    }

    return new EmailClient(`endpoint=${this.options.connectionString}`, this.options.clientOptions);
  }
}
