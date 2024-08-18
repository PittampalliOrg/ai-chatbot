import { Providers, SimpleProvider, ProviderState } from '@microsoft/mgt-element';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationProviderOptions } from '@microsoft/microsoft-graph-client';

export class CustomProvider extends SimpleProvider {
  private _accessToken: string;

  constructor(accessToken: string) {
    super(() => Promise.resolve(accessToken));
    this._accessToken = accessToken;
  }

  async getAccessToken(): Promise<string> {
    // In a real scenario, you might want to check if the current token is still valid
    // and potentially refresh it if needed.
    return this._accessToken;
  }

  async getClient(): Promise<Client> {
    return Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => this._accessToken
      }
    });
  }
}

export function initializeGraphToolkit(accessToken: string): void {
  if (!Providers.globalProvider) {
    Providers.globalProvider = new CustomProvider(accessToken);
    Providers.globalProvider.setState(ProviderState.SignedIn);
  }
}