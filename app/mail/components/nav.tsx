"use client"

import Link from "next/link"
import { removeSpacesFromFolderName } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MailFolder } from "@microsoft/microsoft-graph-types"
import { Archive, ArchiveX, File, Inbox, Send, ShoppingCart, Trash2, Users2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface NavProps {
  folders: MailFolder[]
  isCollapsed: boolean
  currentFolder: string
}

const folderIcons: { [key: string]: any } = {
  Inbox: Inbox,
  Drafts: File,
  Sent: Send,
  Junk: ArchiveX,
  Trash: Trash2,
  Archive: Archive,
  "Deleted Items": Trash2,
  // Add more mappings as needed
}

export function Nav({ folders, isCollapsed, currentFolder }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {folders.map((folder) => {
          const IconComponent = folderIcons[folder.displayName ?? ""] || File
          const isSelected = folder.displayName === currentFolder
          return isCollapsed ? (
            <Tooltip key={folder.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/mail/${removeSpacesFromFolderName(folder.displayName ?? "")}`}
                  className={cn(
                    buttonVariants({ variant: isSelected ? "default" : "ghost", size: "icon" }),
                    "h-9 w-9",
                    isSelected && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="sr-only">{folder.displayName}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {folder.displayName}
                {folder.totalItemCount !== null && folder.totalItemCount !== undefined && (
                  <span className="ml-auto text-muted-foreground">
                    {folder.totalItemCount}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={folder.id}
              href={`/mail/${removeSpacesFromFolderName(folder.displayName ?? "")}`}
              className={cn(
                buttonVariants({ variant: isSelected ? "default" : "ghost", size: "sm" }),
                isSelected && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                "justify-start"
              )}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {folder.displayName}
              {folder.totalItemCount !== null && folder.totalItemCount !== undefined && (
                <span
                  className={cn(
                    "ml-auto",
                    isSelected && "text-accent-foreground"
                  )}
                >
                  {folder.totalItemCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}