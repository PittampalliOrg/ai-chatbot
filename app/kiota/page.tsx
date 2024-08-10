// app/components/MailFolders.tsx

import React from 'react';
import { useSession } from 'next-auth/react';
import { getUserMailFolders } from './graphActions';
import { MailFolderCollectionResponse } from '@/kiota/models';  // Adjust the import path as needed

export default function MailFolders() {
    const { data: session, status } = useSession();
    const [folders, setFolders] = React.useState<MailFolderCollectionResponse | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchFolders() {
            if (status === 'authenticated') {
                try {
                    const response = await getUserMailFolders();
                    setFolders(response || null);
                } catch (err) {
                    setError('Failed to fetch mail folders');
                }
            }
        }
        fetchFolders();
    }, [status]);

    if (status === 'loading') return <p>Loading session...</p>;
    if (status === 'unauthenticated') return <p>Access Denied</p>;
    if (error) return <p>Error: {error}</p>;
    if (!folders) return <p>Loading folders...</p>;

    return (
        <div>
            <h1>Mail Folders</h1>
            <ul>
                {folders.value?.map(folder => (
                    <li key={folder.id}>
                        {folder.displayName} ({folder.totalItemCount} items)
                    </li>
                ))}
            </ul>
        </div>
    );
}