import 'server-only'
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { GraphRequestAdapter } from '@microsoft/msgraph-sdk-core';
import { GraphServiceClient } from '@microsoft/msgraph-sdk';
import { auth, EnrichedSession } from '../auth';

export async function getGraphClient() {
    const session = (await auth()) as EnrichedSession;
    const accessToken = session?.accessToken;

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const authProvider = new AnonymousAuthenticationProvider(async (request) => {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
    });

    const adapter = new FetchRequestAdapter(authProvider);
    const graphAdapter = new GraphRequestAdapter(adapter);
    return new GraphServiceClient(graphAdapter);
}
