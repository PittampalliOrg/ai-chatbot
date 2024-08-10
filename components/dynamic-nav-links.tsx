"use client"

import { use } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MessageSquare, Mail, CheckSquare } from 'lucide-react'

async function getPages() {
  // This is a placeholder function. In a real app, you'd fetch this data
  // from your file system or a CMS.
  return [
    { name: 'Chat', path: '/', icon: MessageSquare },
    { name: 'Mail', path: '/mail', icon: Mail },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    // Add more pages as needed
  ]
}

export function DynamicNavLinks() {
  const pages = use(getPages())
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4">
      {pages.map((page) => (
        <Link
          key={page.path}
          href={page.path}
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
            pathname === page.path
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {page.icon && (
            <page.icon className="w-4 h-4" />
          )}
          <span>{page.name}</span>
        </Link>
      ))}
    </nav>
  )
}