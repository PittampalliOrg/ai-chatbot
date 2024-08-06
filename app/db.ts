import { Client } from '@microsoft/microsoft-graph-client';
import { auth, EnrichedSession } from '../auth';
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';

export default async function getGraphClient() {
    const session = (await auth()) as EnrichedSession;
    const accessToken = session?.accessToken;

    const authProvider = new AnonymousAuthenticationProvider(async (request) => {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
    });

    const client = Client.init({
        authProvider: authProvider,
    });

    return client;
}
