import 'server-only'
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { GraphRequestAdapter } from '@microsoft/msgraph-sdk-core';
import { GraphServiceClient } from '@microsoft/msgraph-sdk';
import { auth, EnrichedSession } from '../auth';
import { Message } from '@microsoft/microsoft-graph-types';
import { Mail } from '../types';

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

export async function getEmails(count: number = 10): Promise<Mail[]> {
    const client = await getGraphClient();
    const messages = await client.me.messages
        .get({
            $top: count,
            $orderby: 'receivedDateTime DESC',
            $select: ['id', 'subject', 'bodyPreview', 'receivedDateTime', 'from', 'isRead']
        });

    return messages.value?.map(convertToMail) ?? [];
}

function convertToMail(message: Message): Mail {
    return {
        id: message.id!,
        name: message.from?.emailAddress?.name ?? 'Unknown',
        email: message.from?.emailAddress?.address ?? 'unknown@example.com',
        subject: message.subject ?? 'No Subject',
        text: message.bodyPreview ?? '',
        date: message.receivedDateTime?.toLocaleString() ?? '',
        read: message.isRead ?? false,
        labels: []
    };
}

export async function markEmailAsRead(emailId: string): Promise<void> {
    const client = await getGraphClient();
    await client.me.messages.byMessageId(emailId).patch({
        isRead: true
    });
}

export async function deleteEmail(emailId: string): Promise<void> {
    const client = await getGraphClient();
    await client.me.messages.byMessageId(emailId).delete();
}
