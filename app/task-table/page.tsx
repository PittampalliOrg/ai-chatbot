'use client'

import React, { useState, useEffect } from 'react'
import { TaskComboboxForm } from './tasks-combobox-form'
import { DataTable } from './data-table'
import { columns } from './columns'
import { getTasks, getLists } from '@/app/actions' // Adjust the import path as needed
import { TodoTask } from "@microsoft/microsoft-graph-types"
import { TodoTaskList } from "@microsoft/microsoft-graph-types"

export default function TasksPage() {
  const [tasks, setTasks] = useState<TodoTask[]>([])
  const [lists, setLists] = useState<TodoTaskList[]>([])
  const [selectedListId, setSelectedListId] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true)
        const fetchedLists = await getLists()
        setLists(fetchedLists)
        if (fetchedLists.length > 0) {
          setSelectedListId(fetchedLists[0].id)
        }
      } catch (err) {
        setError('Failed to fetch lists. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLists()
  }, [])

  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedListId) {
        try {
          setIsLoading(true)
          const fetchedTasks = await getTasks(selectedListId)
          setTasks(fetchedTasks)
        } catch (err) {
          setError('Failed to fetch tasks. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchTasks()
  }, [selectedListId])

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId)
  }

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Tasks</h1>
      <TaskComboboxForm lists={lists} onListSelect={handleListSelect} isLoading={isLoading} />
      <div className="mt-6">
        {isLoading ? (
          <div>Loading tasks...</div>
        ) : (
          <DataTable columns={columns} data={tasks} />
        )}
      </div>
    </div>
  )
}