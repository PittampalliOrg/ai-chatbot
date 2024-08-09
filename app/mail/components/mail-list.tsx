import { Message } from "@microsoft/microsoft-graph-types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MailItem } from "@/app/mail/components/mail-item"

interface MailListProps {
  emails: Message[]
  params: { name: string }
  searchParams: { q?: string; id?: string }
}

export function MailList({ emails, params, searchParams }: MailListProps) {
  return (
    <ScrollArea className="h-full bg-background text-sm font-normal"> {/* Add font styles */}
      <div className="flex flex-col p-2">
        {emails.map((item) => (
          <MailItem
            key={item.id}
            item={item}
            isSelected={searchParams.id === item.id}
            folderName={params.name}
          />
        ))}
      </div>
    </ScrollArea>
  )
}