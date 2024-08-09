// components/compose-email.tsx
'use client';

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from '../actions';
import { useRouter } from 'next/navigation';

export function ComposeEmail() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await sendEmail(formData);
    if (result.success) {
      router.push('/mail/inbox');
    } else {
      // Handle error (e.g., show an error message)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === 'NumpadEnter')) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form action={sendEmail} className="space-y-4 p-4">
      <Input name="to" type="email" placeholder="To" required />
      <Input name="subject" type="text" placeholder="Subject" required />
      <Textarea 
        name="body" 
        placeholder="Message" 
        required 
        className="min-h-[200px]"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}