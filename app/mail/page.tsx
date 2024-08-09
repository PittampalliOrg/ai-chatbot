// page.tsx
import { MailList } from "@/app/mail/components/mail-list"
import { getEmailsForFolder } from "@/app/messages/db/queries"
import { Message } from "@microsoft/microsoft-graph-types"

export default async function MailListPage({ params }: { params: { name: string } }) {
  const emails: Message[]  = await getEmailsForFolder(params.name)
  return <MailList emails={emails} params={params} searchParams={{
    q: undefined,
    id: undefined
  }} />
}