"use client"

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

interface ClientWrapperProps {
  defaultLayout: number[]
  defaultCollapsed: boolean
  navCollapsedSize: number
  children: React.ReactNode
}

export function ClientWrapper({ defaultLayout, defaultCollapsed, navCollapsedSize, children }: ClientWrapperProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
      }}
      className="h-full items-stretch"
    >
      {children}
    </ResizablePanelGroup>
  )
}

export function LeftPanel({ defaultLayout, defaultCollapsed, navCollapsedSize, children }: ClientWrapperProps) {
  return (
    <ResizablePanel
      defaultSize={defaultLayout[0]}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={15}
      maxSize={20}
      onCollapse={() => {
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
      }}
      onExpand={() => {
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
      }}
      className={cn(
        "bg-background text-sm font-normal", // Add font styles
        "overflow-y-auto", // Ensure consistent scrollbar behavior
        defaultCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
      )}
    >
      {children}
    </ResizablePanel>
  )
}

export { ResizablePanel, ResizableHandle }