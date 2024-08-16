'use client';

import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';

type EmailData = {
  to: string;
  subject: string;
  body: string;
};

export function ComposeEmail({ initialData, onSend }: { initialData?: EmailData; onSend: (data: EmailData) => Promise<{ success: boolean, error?: any }> }) {
  const [emailData, setEmailData] = useState<EmailData>(initialData || { to: '', subject: '', body: '' });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean, message: string } | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setSendResult(null);
    try {
      const result = await onSend(emailData);
      if (result.success) {
        setSendResult({ success: true, message: 'Email sent successfully!' });
        router.push('/mail/inbox');
      } else {
        setSendResult({ success: false, message: 'Failed to send email. Please try again.' });
      }
    } catch (error) {
      setSendResult({ success: false, message: 'An error occurred while sending the email.' });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input name="to" type="email" placeholder="To" required value={emailData.to} onChange={handleChange} />
      <Input name="subject" type="text" placeholder="Subject" required value={emailData.subject} onChange={handleChange} />
      <Textarea 
        name="body" 
        placeholder="Message" 
        required 
        className="min-h-[200px]"
        value={emailData.body}
        onChange={handleChange}
      />
      <Button type="submit" disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Email'}
      </Button>
      {sendResult && (
        <p className={sendResult.success ? 'text-green-500' : 'text-red-500'}>
          {sendResult.message}
        </p>
      )}
    </form>
  );
}