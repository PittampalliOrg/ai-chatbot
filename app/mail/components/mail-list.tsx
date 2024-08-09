import Link from 'next/link';
import { formatDistanceToNow } from "date-fns"
import { Message } from "@microsoft/microsoft-graph-types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MailListProps {
  emails: Message[]
  params: { name: string }
  searchParams: { q?: string; id?: string }
}

export function MailList({ emails, params, searchParams }: MailListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col p-2">
        {emails.map((item) => (
          <Link
            key={item.id}
            href={`/mail/${params.name}?id=${item.id}`}
            className={cn(
              "flex flex-col gap-2 rounded-lg p-3 text-left text-sm transition-colors hover:bg-accent",
              searchParams.id === item.id && "bg-muted"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{item.sender?.emailAddress?.name}</div>
                {!item.isRead && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.sentDateTime && formatDistanceToNow(new Date(item.sentDateTime), { addSuffix: true })}
              </div>
            </div>
            <div className="text-xs font-medium">{item.subject}</div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {(item.bodyPreview ?? "").substring(0, 100)}
            </div>
            {item.categories?.length ? (
              <div className="flex items-center gap-2 mt-1">
                {item.categories.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(label: string) {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }
  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }
  return "secondary"
}