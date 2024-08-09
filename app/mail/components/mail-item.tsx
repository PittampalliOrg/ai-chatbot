"use client"

import { ComponentProps } from "react"
import { formatDistanceToNow } from "date-fns"
import { Message } from "@microsoft/microsoft-graph-types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'

interface MailItemProps {
  item: Message
  isSelected: boolean
  folderName: string
}

export function MailItem({ item, isSelected, folderName }: MailItemProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/mail/${folderName}?id=${item.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        isSelected && "bg-muted"
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
          <div
            className={cn(
              "ml-auto text-xs",
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}
          >
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
    </button>
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