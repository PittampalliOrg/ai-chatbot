import { format } from "date-fns"
import { Archive, ArchiveX, Clock, Forward, MoreVertical, Reply, ReplyAll, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Message } from "@microsoft/microsoft-graph-types"
import { getEmailById } from "@/app/messages/db/queries"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MailDisplayProps {
  emailId: string
}

export async function MailDisplay({ emailId }: MailDisplayProps) {
  const email: Message | null = await getEmailById(emailId)

  if (!email) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No message selected</div>
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-2 border-b">
        <ActionButtons />
        <MoreOptions />
      </div>
      <ScrollArea className="flex-grow">
        <EmailContent email={email} />
      </ScrollArea>
    </div>
  )
}

function ActionButtons() {
  return (
    <div className="flex items-center space-x-2">
      <ActionButton icon={<Archive className="h-4 w-4" />} label="Archive" />
      <ActionButton icon={<ArchiveX className="h-4 w-4" />} label="Move to junk" />
      <ActionButton icon={<Trash2 className="h-4 w-4" />} label="Move to trash" />
      <ActionButton icon={<Clock className="h-4 w-4" />} label="Snooze" />
    </div>
  )
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function MoreOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
        <DropdownMenuItem>Star thread</DropdownMenuItem>
        <DropdownMenuItem>Add label</DropdownMenuItem>
        <DropdownMenuItem>Mute thread</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmailContent({ email }: { email: Message }) {
  return (
    <div className="flex flex-col flex-grow overflow-auto">
      <EmailHeader email={email} />
      <Separator />
      <div className="flex-grow p-4 text-sm whitespace-pre-wrap overflow-auto" dangerouslySetInnerHTML={{ __html: email.body?.content ?? "" }} />
      <Separator />
      <ReplyForm email={email} />
    </div>
  )
}

function EmailHeader({ email }: { email: Message }) {
  return (
    <div className="flex items-start p-4 space-x-4">
      <Avatar>
        <AvatarImage alt={email.sender?.emailAddress?.name || ""} />
        <AvatarFallback>
          {email.sender?.emailAddress?.name
            ?.split(" ")
            .map((chunk) => chunk[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-semibold truncate">{email.sender?.emailAddress?.name}</div>
          {email.sentDateTime && (
            <div className="text-xs text-muted-foreground">
              {format(new Date(email.sentDateTime), "PPpp")}
            </div>
          )}
        </div>
        <div className="text-sm truncate">{email.subject}</div>
        <div className="text-xs text-muted-foreground truncate">
          To: {email.toRecipients?.map(r => r.emailAddress?.address).join(", ")}
        </div>
      </div>
    </div>
  )
}

function ReplyForm({ email }: { email: Message }) {
  return (
    <form className="p-4 border-t">
      <div className="space-y-4">
        <Textarea
          className="w-full p-2"
          placeholder={`Reply to ${email.sender?.emailAddress?.name}...`}
          rows={3}
        />
        <div className="flex items-center justify-between">
          <Label
            htmlFor="mute"
            className="flex items-center space-x-2 text-xs"
          >
            <input type="checkbox" id="mute" className="form-checkbox" />
            <span>Mute this thread</span>
          </Label>
          <Button type="submit" size="sm">
            Send
          </Button>
        </div>
      </div>
    </form>
  )
}