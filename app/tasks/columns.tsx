"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { TodoTask } from "@microsoft/microsoft-graph-types"
import { DataTableColumnHeader } from "./components/data-table-column-header"
import { DataTableRowActions } from "./components/data-table-row-actions"
import { OptimisticTask } from "@/types"

const statusIcons = {
  notStarted: () => <span className="text-gray-500">●</span>,
  inProgress: () => <span className="text-blue-500">●</span>,
  completed: () => <span className="text-green-500">●</span>,
}

const importanceIcons = {
  low: () => <span className="text-gray-500">▼</span>,
  normal: () => <span className="text-blue-500">■</span>,
  high: () => <span className="text-red-500">▲</span>,
}

export const columns: ColumnDef<OptimisticTask>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined
      const StatusIcon = status ? statusIcons[status as keyof typeof statusIcons] : statusIcons.notStarted
      return (
        <div className="flex items-center">
          <StatusIcon />
          <span className="ml-2 capitalize">{status || "Not Started"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "importance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Importance" />,
    cell: ({ row }) => {
      const importance = row.getValue("importance") as string | undefined
      const ImportanceIcon = importance ? importanceIcons[importance as keyof typeof importanceIcons] : importanceIcons.normal
      return (
        <div className="flex items-center">
          <ImportanceIcon />
          <span className="ml-2 capitalize">{importance || "Normal"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdDateTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdDateTime = row.getValue("createdDateTime") as string | undefined
      return (
        <span>{createdDateTime ? new Date(createdDateTime).toLocaleDateString() : "N/A"}</span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]