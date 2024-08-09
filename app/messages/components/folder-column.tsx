import Link from 'next/link';
import { getFoldersWithEmailCount } from '@/app/messages/db/queries';
import { FlagIcon } from '@/app/messages/icons/flag';
import { FolderIcon } from '@/app/messages/icons/folder';
import { InboxIcon } from '@/app/messages/icons/inbox';
import { SentIcon } from '@/app/messages/icons/sent';
import { removeSpacesFromFolderName } from '@/app/messages/db/utils';
import { Folder } from '@/app/messages/db/queries';

import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../../../components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  Flag,
} from "lucide-react"



interface NavProps extends Folder {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: string
    variant: "default" | "ghost"
  }[]
}


export async function FolderColumn() {
  const { specialFolders, otherFolders } = await getFoldersWithEmailCount();

  const links = specialFolders.map((folder) => ({
    title: folder.name,
    label: folder.email_count,
    icon: folder.name === 'Inbox' ? "" : folder.name === 'Drafts' ? "" : "",
    variant: "default" as const
  }));

  const otherLinks = otherFolders.map((folder) => ({
    title: folder.name,
    label: folder.email_count,
    icon: "",
    variant: "default" as const
  }));

  return (
    <div
      data-collapsed={false}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          false ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/f/${removeSpacesFromFolderName(link.title)}`}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={`/f/${removeSpacesFromFolderName(link.title)}`}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                    "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
