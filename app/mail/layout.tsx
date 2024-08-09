import { Suspense } from "react"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcherWrapper } from "./components/account-switcher-wrapper"
import { Nav } from "./components/nav"
import { accounts } from "./data"
import { getEmailFolders } from "@/app/actions"
import { ClientWrapper, LeftPanel, ResizablePanel, ResizableHandle } from "./client-wrapper"
import { cn } from "@/lib/utils"

export default async function EmailLayout({ children, params }: { children: React.ReactNode; params: { name: string } }) {
  const defaultLayout = [265, 655]
  const defaultCollapsed = false
  const navCollapsedSize = 4
  const folders = await getEmailFolders()

  return (
    <TooltipProvider delayDuration={0}>
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
          <div className={cn("flex h-[52px] items-center justify-center", defaultCollapsed ? "h-[52px]" : "px-2")}>
            <AccountSwitcherWrapper accounts={accounts} />
          </div>
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
    </TooltipProvider>
  )
}