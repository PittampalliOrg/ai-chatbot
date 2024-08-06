import { GraphServiceClient } from '@microsoft/msgraph-sdk';
import { getGraphClient } from './db';

export async function getUser(): Promise<any> {
    const client = await getGraphClient();
    const user = await client.me.get();
    return user;
}

export async function getUserPhoto() {
    const client = await getGraphClient();
    try {
        const photo = await client.me.photo.content.get();
        return photo;
    } catch (error) {
        console.error('Error fetching user photo:', error);
        return null;
    }
}

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
    const client = await getGraphClient();
    await client.me.sendMail.post({
        message: {
            subject: subject,
            body: {
                contentType: 'Text',
                content: body
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to
                    }
                }
            ]
        }
    });
}
