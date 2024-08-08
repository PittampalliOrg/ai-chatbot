"use client"

import React, { useState } from 'react'
import { AccountSwitcher } from './account-switcher'

interface AccountSwitcherWrapperProps {
  accounts: {
    label: string
    email: string
    icon: string
  }[]
}

export function AccountSwitcherWrapper({ accounts }: AccountSwitcherWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="mb-2 p-2 text-sm">
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
    </div>
  )
}