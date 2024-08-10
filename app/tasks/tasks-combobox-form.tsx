'use client'

import * as React from "react"
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TodoTaskList } from "@microsoft/microsoft-graph-types"
import { selectList } from '@/app/actions' // Assuming you've created this server action
import { CommandList } from "cmdk"


interface TaskComboboxFormProps {
  lists: TodoTaskList[]
  selectedListId: string
  changeList: (listId: string) => Promise<void>
}

export function TaskComboboxForm({ lists, selectedListId, changeList }: TaskComboboxFormProps) {
  const [open, setOpen] = React.useState(false)
  const initialListId = ""; // Replace the empty string with the initial value you want to assign to 'initialListId'
  const [value, setValue] = React.useState(initialListId);
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSelectList = (listId: string) => {
    setValue(listId)
    setOpen(false)
    startTransition(async () => {
      await selectList(listId)
      router.refresh()
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isPending}
        >
          {value
            ? lists.find((list) => list.id === value)?.displayName
            : "Select list..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search list..." />
          <CommandList>
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandGroup>
            {lists.map((list) => (
              <CommandItem
                key={list.id}
                value={list.id}
                onSelect={handleSelectList}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === list.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {list.displayName}
              </CommandItem>
            ))}
          </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}