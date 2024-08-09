import { TaskComboboxForm } from '@/components/tasks/tasks-combobox-form'
import { DataTable } from './data-table'
import { columns } from './columns'
import { getTasks } from '@/app/actions' // Adjust the import path as needed
import { Task } from './taskTypes'

export default async function TasksPage() {
  const tasks: Task[] = await getTasks()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Tasks</h1>
      <TaskComboboxForm />
      <div className="mt-6">
        <DataTable columns={columns} data={tasks} />
      </div>
    </div>
  )
}