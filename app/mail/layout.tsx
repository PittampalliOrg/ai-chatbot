import { Suspense } from "react"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcherWrapper } from "./components/account-switcher-wrapper"
import { Nav } from "./components/nav"
import { accounts } from "./data"
import { getEmailFolders } from "@/app/actions"

export default async function EmailLayout({ children, params }: { children: React.ReactNode; params: { name: string } }) {
  const defaultLayout = [20, 80]
  const folders = await getEmailFolders()

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup direction="horizontal" className="h-full max-h-[800px] items-stretch">
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={15} maxSize={20}>
          <Suspense fallback={<div>Loading accounts...</div>}>
            <AccountSwitcherWrapper accounts={accounts} />
          </Suspense>
          <Separator />
          <Suspense fallback={<div>Loading folders...</div>}>
            <Nav
              folders={folders}
              isCollapsed={false}
              currentFolder={params.name}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]}>
          <Suspense fallback={<div>Loading content...</div>}>
            {children}
          </Suspense>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}