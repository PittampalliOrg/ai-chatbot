'use client'

import * as React from "react"
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

interface TaskComboboxFormProps {
  lists: TodoTaskList[] | undefined
  onListSelect: (listId: string) => void
  isLoading?: boolean
}

export function TaskComboboxForm({ lists, onListSelect, isLoading = false }: TaskComboboxFormProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  if (isLoading) {
    return <Button disabled>Loading lists...</Button>
  }

  if (!lists || lists.length === 0) {
    return <Button disabled>No lists available</Button>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandGroup>
            {lists.map((list) => (
              <CommandItem
                key={list.id}
                value={list.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  onListSelect(currentValue)
                }}
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}