import React, { useState, useEffect } from 'react'
import { TaskComboboxForm } from './tasks-combobox-form'
import { DataTable } from './data-table'
import { columns } from './columns'
import { getTasks, getLists } from './actions' // Adjust the import path as needed
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"



export default async function TasksPage({children}: {children: React.ReactNode}) {
  const lists: TodoTaskList[] = await getLists();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Tasks</h1>
      <TaskComboboxForm lists={lists} />
      {children}
    </div>
  )
}