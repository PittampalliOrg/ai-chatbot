"use client";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { JSX, SVGProps } from "react";
import { useOptimistic } from 'react';
import { addTasks } from '../../app/actions';
import { TodoTask } from '@microsoft/microsoft-graph-types';
import { deleteTasks } from "../../app/actions";
import { OptimisticTask } from "../../types";


export function TodoList({ tasks }: { tasks: OptimisticTask[] }) {
  async function formAction(formData: FormData) {
    addOptimisticItem(formData.get('item') as string);
    let titles: string[] = [formData.get('item') as string];

    await addTasks("AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=", titles);
  };
;

  const [optimisticItems, addOptimisticItem] = useOptimistic<OptimisticTask[], string>(tasks, (state, newTask) => [...state, { title: newTask, sending: true }]);

  return (
    <div className="bg-background text-foreground rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </header>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <form action={formAction}>
            <Input type="text" name="item" placeholder="Make a video ... " className="flex-1" />
            <Button type="submit">Add</Button>
          </form>
        </div>
        <div className="space-y-2">
          {optimisticItems.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-muted rounded-md p-3"
            >
              <div className="flex items-center gap-3">
                <Checkbox id={item.id} defaultChecked={item.status === "completed"} />
                <label
                  htmlFor={item.id}
                  className={`text-sm font-medium ${item.status === "completed" ? 'line-through' : ''
                    }`}
                >
                  {item.title}
                  {!!item.sending && <small> (Sending ... )</small>}
                </label>
              </div>
              <Button type="submit" variant="ghost" size="icon" onClick={async () => {
                await deleteTasks("AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=", 
                  [item.id as string]);
        }}>
                <TrashIcon className="w-5 h-5" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

