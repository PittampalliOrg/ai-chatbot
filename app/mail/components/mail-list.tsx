import { ComponentProps } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Message } from "@microsoft/microsoft-graph-types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface MailListProps {
  emails: Message[]
  params: { name: string }
  searchParams: { q?: string; id?: string }
}

export function MailList({ emails, params, searchParams }: MailListProps) {
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {emails.map((item) => (
          <Link
            key={item.id}
            href={`/mail/${params.name}?id=${item.id}`}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              searchParams.id === item.id && "bg-muted"
            )}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.sender?.emailAddress?.name}</div>
                  {!item.isRead && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {item.sentDateTime && formatDistanceToNow(new Date(item.sentDateTime), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {(item.bodyPreview ?? "").substring(0, 300)}
            </div>
            {item.categories?.length ? (
              <div className="flex items-center gap-2">
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

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}