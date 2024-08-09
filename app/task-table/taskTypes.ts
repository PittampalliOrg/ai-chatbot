import { TodoTask } from "@microsoft/microsoft-graph-types"

export type Task = TodoTask

export interface TasksResponse {
  value: Task[]
}