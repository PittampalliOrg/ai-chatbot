import React, { useState, useEffect } from 'react'
import { TaskComboboxForm } from '../tasks-combobox-form'
import { DataTable } from '../data-table'
import { columns } from '../columns'
import { getTasks, getLists } from '../actions' // Adjust the import path as needed
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"

export default async function TasksPage({params}: {params: {listId: string}}) {
  const tasks: TodoTask[] = await getTasks(params.listId);

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={tasks} initialTasks={tasks} />
    </div>
  )
}