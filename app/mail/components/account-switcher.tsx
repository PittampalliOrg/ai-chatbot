"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AccountSwitcherProps {
  currentAccount: {
    label: string;
    email: string;
    image: string;
  };
  isCollapsed: boolean;
}

export function AccountSwitcher({ currentAccount, isCollapsed }: AccountSwitcherProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select account"
          className={cn(
            "w-full justify-between",
            isCollapsed ? "h-9 w-9 p-0" : "px-2"
          )}
        >
          <Avatar className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")}>
            <AvatarImage src={currentAccount.image} alt={currentAccount.label} />
            <AvatarFallback>{currentAccount.label[0]}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <span className="truncate">{currentAccount.email}</span>
          )}
          {!isCollapsed && (
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search account..." />
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup heading="Current Account">
              <CommandItem
                onSelect={() => setOpen(false)}
                className="text-sm"
              >
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={currentAccount.image} alt={currentAccount.label} />
                  <AvatarFallback>{currentAccount.label[0]}</AvatarFallback>
                </Avatar>
                <span className="truncate">{currentAccount.email}</span>
                <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}