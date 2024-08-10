import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { TodoTask } from "@microsoft/microsoft-graph-types"

interface DataTableToolbarProps {
  table: Table<TodoTask>
  onAddTask: (title: string) => Promise<void>
  onDeleteTasks: () => Promise<void>
}

export function DataTableToolbar({
  table,
  onAddTask,
  onDeleteTasks,
}: DataTableToolbarProps) {
  const [newTaskTitle, setNewTaskTitle] = React.useState("")

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim())
      setNewTaskTitle("")
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="h-8 w-[200px] lg:w-[300px]"
        />
        <Button onClick={handleAddTask} size="sm">
          Add Task
        </Button>
        <Button onClick={onDeleteTasks} size="sm" variant="destructive">
          Delete Selected
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}