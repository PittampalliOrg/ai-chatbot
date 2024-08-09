import { Suspense } from "react"
import { MailList } from "@/app/mail/components/mail-list"
import { MailDisplay } from "@/app/mail/components/mail-display"
import { getEmailsForFolder } from "@/app/messages/db/queries"
import { Message } from "@microsoft/microsoft-graph-types"

interface MailListPageProps {
  params: { name: string }
  searchParams: { q?: string; id?: string }
}

export default async function MailListPage({ params, searchParams }: MailListPageProps) {
  const emails: Message[] = await getEmailsForFolder(params.name)

  return (
    <div className="flex h-full">
      <div className="w-1/3 h-full overflow-hidden border-r">
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading emails...</div>}>
          <MailList emails={emails} params={params} searchParams={searchParams} />
        </Suspense>
      </div>
      <div className="w-2/3 h-full overflow-hidden">
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading email content...</div>}>
          {searchParams.id ? (
            <MailDisplay emailId={searchParams.id} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select an email to view
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}