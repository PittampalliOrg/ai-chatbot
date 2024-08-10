// app/actions/graphActions.ts

import { initializeGraphClient } from './graphClientSetup';

export async function getUserMailFolders() {
    const client = initializeGraphClient();
    try {
        const response = await client.me.mailFolders.get({
            queryParameters: {
                top: 10,
                select: ["displayName", "totalItemCount"]
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching mail folders:', error);
        throw error;
    }
}