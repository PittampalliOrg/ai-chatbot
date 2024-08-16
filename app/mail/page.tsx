import { MailList } from "@/app/mail/components/mail-list"
import { getEmailsForFolder } from "@/app/mail/queries"
import { Message } from "@microsoft/microsoft-graph-types"

export default async function MailListPage({ params, searchParams }: { params: { name: string }, searchParams: { q?: string; id?: string; queryParams?: string } }) {
  const emails: Message[] = await getEmailsForFolder(params.name, searchParams.queryParams)
  return <MailList emails={emails} params={params} searchParams={searchParams} />
}