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
        const authProvider = graphClient.getAuthenticationProvider();
        const apiClient = new ApiClient(authProvider);

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
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recent Messages</h1>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{message.subject}</h2>
            <p className="text-sm text-gray-600">From: {message.from?.emailAddress?.name}</p>
            <p className="text-sm text-gray-600">
              Received: {new Date(message.receivedDateTime || '').toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
