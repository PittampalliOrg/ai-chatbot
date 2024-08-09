"use client"

import React from 'react'
import { AccountSwitcher } from './account-switcher'
import { cn } from '@/lib/utils';

interface AccountSwitcherWrapperProps {
  currentAccount: {
    label: string;
    email: string;
    image: string;
  };
  isCollapsed: boolean;
}

export function AccountSwitcherWrapper({ currentAccount, isCollapsed }: AccountSwitcherWrapperProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      isCollapsed ? "h-9 w-9" : "p-2"
    )}>
      <AccountSwitcher currentAccount={currentAccount} isCollapsed={isCollapsed} />
    </div>
  )
}