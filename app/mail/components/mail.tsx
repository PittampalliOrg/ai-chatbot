import { Suspense } from "react"
import {
  AlertCircleIcon,
  ArchiveIcon,
  ArchiveXIcon,
  FileIcon,
  InboxIcon,
  MessagesSquareIcon,
  Search,
  SendIcon,
  ShoppingCartIcon,
  Trash2Icon,
  Users2Icon,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"
import { Nav } from "./nav"
import { Message } from "@microsoft/microsoft-graph-types"
import { getEmailsForFolder } from "@/app/messages/db/queries"
import { AccountSwitcherWrapper } from "./account-switcher-wrapper"

// get accounts from data
import { accounts } from "../data"

interface MailProps {
  defaultLayout?: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize?: number
  params: { name: string }
}
export async function Mail({
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  params
}: MailProps) {
  const mails: Message[] = await getEmailsForFolder(params.name)

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          className="min-w-[50px] transition-all duration-300 ease-in-out"
        >
          <Suspense fallback={<div>Loading accounts...</div>}>
            <AccountSwitcherWrapper accounts={accounts} />
          </Suspense>
          <Separator />
          <Nav
            links={[
              {
                title: "Inbox",
                label: "128",
                icon: "InboxIcon",
                variant: "default",
              },
              {
                title: "Drafts",
                label: "9",
                icon: "FileIcon",
                variant: "ghost",
              },
              {
                title: "Sent",
                label: "",
                icon: "SendIcon",
                variant: "ghost",
              },
              {
                title: "Junk",
                label: "23",
                icon: "ArchiveXIcon",
                variant: "ghost",
              },
              {
                title: "Trash",
                label: "",
                icon: "Trash2Icon",
                variant: "ghost",
              },
              {
                title: "Archive",
                label: "",
                icon: "ArchiveIcon",
                variant: "ghost",
              },
            ]}
            isCollapsed={false}
          />
          <Separator />
          <Nav
            links={[
              {
                title: "Social",
                label: "972",
                icon: "Users2Icon",
                variant: "ghost",
              },
              {
                title: "Updates",
                label: "342",
                icon: "AlertCircleIcon",
                variant: "ghost",
              },
              {
                title: "Forums",
                label: "128",
                icon: "MessagesSquareIcon",
                variant: "ghost",
              },
              {
                title: "Shopping",
                label: "8",
                icon: "ShoppingCartIcon",
                variant: "ghost",
              },
              {
                title: "Promotions",
                label: "21",
                icon: "ArchiveIcon",
                variant: "ghost",
              },
            ]}
            isCollapsed={false}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <Suspense fallback={<div>Loading emails...</div>}>
                <MailList />
              </Suspense>
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <Suspense fallback={<div>Loading unread emails...</div>}>
                <MailList />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <Suspense fallback={<div>Loading email content...</div>}>
            <MailDisplay />
          </Suspense>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

