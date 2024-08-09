import { Suspense } from "react"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcherWrapper } from "./components/account-switcher-wrapper"
import { Nav } from "./components/nav"
import { accounts } from "./data"
import { getEmailFolders } from "./actions"
import { ClientWrapper, LeftPanel, ResizablePanel, ResizableHandle } from "./components/client-wrapper"
import { cn } from "@/lib/utils"
import { AccountSwitcherServer } from "./components/account-switcher-server"

export default async function MailLayout({ children, params }: { children: React.ReactNode; params: { name: string } }) {
  const defaultLayout = [265, 655]
  const defaultCollapsed = false
  const navCollapsedSize = 4
  const folders = await getEmailFolders()

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen-dvh flex overflow-hidden bg-background prevent-shift">
        <ClientWrapper
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={navCollapsedSize}
        >
          <LeftPanel
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={navCollapsedSize}
          >
            <AccountSwitcherServer isCollapsed={defaultCollapsed} />
            <Separator />
            <Nav
              folders={folders}
              isCollapsed={defaultCollapsed}
              currentFolder={params.name}
            />
          </LeftPanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <Suspense fallback={<div>Loading content...</div>}>
              {children}
            </Suspense>
          </ResizablePanel>
        </ClientWrapper>
      </div>
    </TooltipProvider>
  )
}