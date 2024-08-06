'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '../../kiota/apiClient';
import getGraphClient from '../db';
import { Message } from '../../kiota/models';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const graphClient = await getGraphClient();
        const apiClient = new ApiClient(graphClient);

        const response = await apiClient.me.messages.get({
          queryParameters: {
            $top: 10,
            $orderby: 'receivedDateTime DESC',
          },
        });

        if (response.value) {
          setMessages(response.value);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to fetch messages. Please try again later.');
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (loading) {
    return <div aria-live="polite" role="status">Loading messages...</div>;
  }

  if (error) {
    return <div aria-live="assertive" role="alert">Error: {error}</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recent Messages</h1>
      {messages.length > 0 ? (
        <ul className="space-y-4" aria-label="List of recent messages">
          {messages.map((message) => (
            <li key={message.id} className="border p-4 rounded-lg">
              <h2 className="font-semibold">{message.subject || 'No Subject'}</h2>
              <p className="text-sm text-gray-600">From: {message.from?.emailAddress?.name || 'Unknown Sender'}</p>
              <p className="text-sm text-gray-600">
                Received: {message.receivedDateTime ? new Date(message.receivedDateTime).toLocaleString() : 'Unknown Date'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p aria-live="polite">No messages found.</p>
      )}
    </main>
  );
}
