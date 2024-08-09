import { getEmailById } from "@/app/messages/db/queries"
import { Message } from "@microsoft/microsoft-graph-types"

interface MailDisplayProps {
  emailId: string
}

export async function MailDisplay({ emailId }: MailDisplayProps) {
  const email: Message | null = await getEmailById(emailId)

  if (!email) {
    return <div className="p-4">Email not found</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{email.subject}</h2>
      <p className="mb-2">From: {email.sender?.emailAddress?.name} ({email.sender?.emailAddress?.address})</p>
      <p className="mb-4">Sent: {new Date(email.sentDateTime ?? "").toLocaleString()}</p>
      <div dangerouslySetInnerHTML={{ __html: email.body?.content ?? "" }} />
    </div>
  )
}