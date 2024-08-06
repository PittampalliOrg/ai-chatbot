'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '../../kiota/apiClient';
import { ApiClientFactory } from '../../kiota/apiClientFactory';
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
        const apiClient = ApiClientFactory.create(graphClient);

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
    return <div aria-live="polite" role="status" className="text-center mt-8">Loading messages...</div>;
  }

  if (error) {
    return <div aria-live="assertive" role="alert" className="text-red-600 text-center mt-8">Error: {error}</div>;
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Recent Messages</h1>
      {messages.length > 0 ? (
        <ul className="space-y-6" aria-label="List of recent messages">
          {messages.map((message) => (
            <li key={message.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-semibold text-lg mb-2">{message.subject || 'No Subject'}</h2>
              <p className="text-sm text-gray-600 mb-1">From: {message.from?.emailAddress?.name || 'Unknown Sender'}</p>
              <p className="text-sm text-gray-600">
                Received: {message.receivedDateTime ? new Date(message.receivedDateTime).toLocaleString() : 'Unknown Date'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p aria-live="polite" className="text-center text-gray-600 mt-8">No messages found.</p>
      )}
    </main>
  );
}
