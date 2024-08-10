'use server'

import { revalidatePath } from 'next/cache'

import { TodoTask, TodoTaskList } from '@microsoft/microsoft-graph-types'
import  getGraphClient from '@/app/db'


export async function getTasks(listId: string = "AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA="): Promise<TodoTask[]> {
    const client = await getGraphClient();
    
    const response = await client
      .api(`/me/todo/lists/${listId}/tasks`)
      .get();
  
    return response.value;
  }

export async function getLists() {
    const client = await getGraphClient();
    const response = await client
      .api(`/me/todo/lists`)
      .get();
  
      console.log(response);
  
    const lists: TodoTaskList[] = await response.value;
  
    return lists;
  }
  
  
  export async function addTasks(listId: string = "AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=", tasks: string[]): Promise<TodoTask[]> {
    const client = await getGraphClient();
    let addedTasks: TodoTask[] = [];
  
    if (tasks.length < 2) {
      const todoTask = { title: tasks[0] };
      const singleTaskResponse = await client
        .api(`/me/todo/lists/${listId}/tasks`)
        .post(todoTask);
  
      addedTasks.push({
        id: singleTaskResponse.id,
        title: singleTaskResponse.title,
        status: singleTaskResponse.status,
        createdDateTime: singleTaskResponse.createdDateTime,
        lastModifiedDateTime: singleTaskResponse.lastModifiedDateTime,
        importance: singleTaskResponse.importance,
        isReminderOn: singleTaskResponse.isReminderOn,
        hasAttachments: singleTaskResponse.hasAttachments,
        categories: singleTaskResponse.categories,
        body: {
          content: singleTaskResponse.body.content,
          contentType: singleTaskResponse.body.contentType,
        },
      });
    } else {
      const batchRequestBody = {
        requests: tasks.map((task, index) => ({
          id: index.toString(),
          method: "POST",
          url: `/me/todo/lists/${listId}/tasks`,
          headers: {
            "Content-Type": "application/json"
          },
          body: { title: task }
        }))
      };
  
      const batchResponse = await client
        .api('/$batch')
        .post(batchRequestBody);
  
      const responses = batchResponse.responses;
      addedTasks = responses
        .filter((res: any) => res.status === 201) // Only include successfully created tasks
        .map((res: any) => ({
          id: res.body.id,
          title: res.body.title,
          status: res.body.status,
          createdDateTime: res.body.createdDateTime,
          lastModifiedDateTime: res.body.lastModifiedDateTime,
          importance: res.body.importance,
          isReminderOn: res.body.isReminderOn,
          hasAttachments: res.body.hasAttachments,
          categories: res.body.categories,
          body: {
            content: res.body.body.content,
            contentType: res.body.body.contentType,
          },
        }));
    }
  
    revalidatePath('/tasks');
    console.log(addedTasks);
    return addedTasks;
  }
  
  
  export async function deleteTasks(listId: string = "AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=", taskIds: string[]) {
  
    const client = await getGraphClient();
  
  if (taskIds.length < 2) {
  
    await client
      .api(`/me/todo/lists/${listId}/tasks/${taskIds[0]}`)
      .delete();
  }
  
  else {
  
    const batchRequestBody = {
      requests: taskIds.map((taskId, index) => ({
        id: index.toString(),
        method: "DELETE",
        url: `/me/todo/lists/${listId}/tasks/${taskId}`,
        headers: {
          "Content-Type": "application/json"
        }
      }))
    };
  
    await client
    .api('/$batch')
    .post(batchRequestBody);
  }
  
  revalidatePath('/tasks');
  }
  