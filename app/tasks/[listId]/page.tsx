import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TaskComboboxForm } from '../tasks-combobox-form'
import { DataTable } from '../data-table'
import { columns } from '../columns'
import { getTasks, getLists  } from '@/app/actions'
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"

interface TasksPageProps {
  params: { listId: string }
}


export default async function TasksPage({ params }: TasksPageProps) {
  const { listId } = params
  const lists = await getLists();
  const tasks = await getTasks(listId);

  if (!lists.some(list => list.id === listId)) {
    notFound()
  }

  function changeList(listId: string): Promise<void> {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Tasks</h1>
      <Suspense fallback={<div>Loading lists...</div>}>
        <TaskComboboxForm lists={lists} selectedListId={listId} changeList={changeList} />
      </Suspense>
      <div className="mt-6">
        <Suspense fallback={<div>Loading tasks...</div>}>
          <DataTable columns={columns} data={tasks} />
        </Suspense>
      </div>
    </div>
  )
}


