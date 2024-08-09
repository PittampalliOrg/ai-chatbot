// File: lib/graphClient.ts
import { AnonymousAuthenticationProvider, RequestInformation } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { createApiClient, ApiClient } from '@/kiota/apiClient';

export function initializeGraphClient(accessToken: string): ApiClient {
  const authProvider = new AnonymousAuthenticationProvider();

  const requestAdapter = new FetchRequestAdapter(authProvider);
  return createApiClient(requestAdapter);
}