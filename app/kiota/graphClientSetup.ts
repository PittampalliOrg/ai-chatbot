// app/kiota/graphClientSetup.ts

import { createApiClient, ApiClient } from '@/kiota/apiClient';  // Adjust the import path as needed
import { NextAuthRequestAdapter } from './requestAdapter';
import { RequestAdapter } from '@microsoft/kiota-abstractions';

export function initializeGraphClient(): ApiClient {
    const adapter = new NextAuthRequestAdapter();
    return createApiClient(adapter as RequestAdapter);
}