import { DefaultAzureCredential } from '@azure/identity';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class AzureIdentityProvider {
  public readonly azureCredential: DefaultAzureCredential;
  constructor() {
    this.azureCredential = new DefaultAzureCredential();
  }
}
