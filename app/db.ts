import 'server-only'
import { Client } from '@microsoft/microsoft-graph-client';
import { auth, EnrichedSession } from '../auth';
import { MailFolder, Message } from "@microsoft/microsoft-graph-types";

export default async function getGraphClient() {
    const session = (await auth()) as EnrichedSession;
    const accessToken = session?.accessToken;

    const client = Client.init({
        authProvider: (done) =>
            done(
                null,
                accessToken
            ),
    });

    return client 
}

export async function getEmailFolders(): Promise<MailFolder[]> {
  const client = await getGraphClient();
  const response = await client.api('/me/mailFolders').get();
  return response.value;
}

export async function getMessagesForFolder(folderName: string, folderId: string): Promise<Message[]> {
  const client = await getGraphClient();
  const response = await client.api(`/me/mailFolders/${folderId}/messages`)
    .select('subject,from,receivedDateTime,bodyPreview')
    .top(50)
    .orderBy('receivedDateTime DESC')
    .get();
  return response.value;
}
