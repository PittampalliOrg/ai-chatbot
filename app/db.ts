import 'server-only'
import { Client } from '@microsoft/microsoft-graph-client';
import { auth, EnrichedSession } from '../auth'; // Replace './auth' with the correct path to the file containing the EnrichedSession type
import { Message } from '@microsoft/microsoft-graph-types';


export default async function getGraphClient() {
    const session = (await auth()) as EnrichedSession;
    const accessToken = session?.accessToken;

    const client = Client.init({
        authProvider: (done) => done(null, accessToken),
    });

    return client;
}

export async function getMessagesFromFolder(folderId: string): Promise<Message[]> {
    const client = await getGraphClient();
    const response = await client.api(`/me/mailFolders/${folderId}/messages`)
        .select('subject,from,receivedDateTime,bodyPreview')
        .top(50)
        .get();
    return response.value;
}
