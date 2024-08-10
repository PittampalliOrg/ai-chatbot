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
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TodoTaskList } from "@microsoft/microsoft-graph-types"
import { useRouter } from 'next/navigation'

interface TaskComboboxFormProps {
  lists: TodoTaskList[]
}

export function TaskComboboxForm({lists}: TaskComboboxFormProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter()

  const onListSelect = (listId: string) => {
    setValue(listId)  // Set the selected list ID
    router.push(`/tasks/${listId}`)
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
            ? lists.find((list) => list.id === value)?.displayName || "Select list..."
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
                onSelect={(currentValue: string) => {
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
