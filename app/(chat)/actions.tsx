import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage
} from '@/components/stocks'

import { z } from 'zod'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { addTasks, deleteTasks, getTasks, saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth, EnrichedSession } from '@/auth'
import WeatherCard from '@/components/weather/weather'
import { TodoList } from '@/components/tasks/tasks'
import Search from '@/components/search'
import { Mail as MailType, OptimisticTask } from '@/types'
import { accounts } from '@/app/mail/data'
import { TaskComboboxForm } from '@/app/tasks/tasks-combobox-form'
import { getEmails, sendEmail } from '../mail/actions'
import { columns } from '../tasks/columns'
import { TodoTask } from '@microsoft/microsoft-graph-types'
import { DataTable } from '../tasks/data-table'
import { MailList } from '../mail/components/mail-list'
import MailLayout from '../mail/layout'
import MailListPage from '../mail/page'
import { ComposeEmail } from '../mail/components/compose-email'
import { Button } from "@/components/ui/button"

// ... (keep the confirmPurchase function as is)

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-4o'),
    initial: <SpinnerMessage />,
    system: `You are an intelligent assistant designed to help users manage their Microsoft ToDo tasks efficiently and handle their emails. You will interact with the Microsoft Graph API to perform various task management and email operations. Your primary functions include:

1. Task Management:
   - Get Task Lists: Retrieve and display the user's task lists.
   - Get Tasks: Retrieve and display tasks from a specific task list.
   - Add Tasks: Add new tasks.
   - Delete Tasks: Remove tasks from a specified task list.

2. Email Management:
   - Show Emails: Retrieve and display the user's emails based on specified criteria.
   - Compose Email: Help users draft new emails.

3. Weather Information:
   - Provide weather information for a given city.

When interacting with users, ensure to:
- Confirm the action they want to perform.
- Request necessary details (e.g., task list name, task details, email recipients).
- Provide clear feedback on the success or failure of each operation.
- Handle errors gracefully and provide helpful troubleshooting information.

Your responses should be clear, concise, and focused on the user's productivity and efficiency. Always prioritize the user's needs and preferences when suggesting actions or providing information.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      getWeather: {
        description: 'Get the weather information for a given city.',
        parameters: z.object({
          city: z.string().describe('The name of the city.'),
        }),
        generate: async function* ({ city }) {
          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getWeather',
                    toolCallId,
                    args: { city },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getWeather',
                    toolCallId,
                    result: { city },
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              <WeatherCard city={city} />
            </BotCard>
          )
        }
      },
      showTasks: {
        description: 'Display the user tasks.',
        parameters: z.object({
          count: z.number().default(5).describe('The number of tasks to display.')
        }),
        generate: async function* ({ count }) {
          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showTasks',
                    toolCallId,
                    args: { count },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showTasks',
                    toolCallId,
                    result: { count },
                  },
                ],
              },
            ],
          });

          const tasks: TodoTask[] = await getTasks();

          return (
            <BotCard>
              <DataTable columns={columns} data={tasks} initialTasks={tasks} />
            </BotCard>
          );
        },
      },
      addTasks: {
        description: 'Add new tasks',
        parameters: z.object({
          titles: z.array(z.string()).describe('The titles of the tasks.')
        }),
        generate: async function* ({ titles }) {
          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'addTasks',
                    toolCallId,
                    args: { titles },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'addTasks',
                    toolCallId,
                    result: {},
                  },
                ],
              },
            ],
          });
          console.log(titles);
          let addTaskResponse = await addTasks("AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=", titles);

          return (
            <BotCard>
              <DataTable columns={columns} data={addTaskResponse} initialTasks={addTaskResponse} />
            </BotCard>
          );
        },
      },
      deleteTasks: {
        description: 'Delete tasks from a specified task list.',
        parameters: z.object({
          listId: z.string().describe('The ID of the task list containing the tasks to delete.'),
          taskIds: z.array(z.string()).describe('The IDs of the tasks to delete.')
        }),
        generate: async function* ({ listId, taskIds }) {
          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'deleteTasks',
                    toolCallId,
                    args: { listId, taskIds },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'deleteTasks',
                    toolCallId,
                    result: {},
                  },
                ],
              },
            ],
          });

          const deletedTasks = await deleteTasks(listId, taskIds);

          return (
            <BotCard>
              <p>Tasks deleted successfully.</p>
            </BotCard>
          );
        },
      },
      showEmails: {
        description: 'Display user emails based on specified criteria.',
        parameters: z.object({
          queryParams: z.string().describe('OData query parameters to apply to the email request. This can include $filter, $search, $top, $select, $orderby, etc. Example: "$filter=receivedDateTime ge 2023-01-01T00:00:00Z&$search=\'important meeting\'&$top=50&$orderby=receivedDateTime desc"')
        }),
        generate: async function* ({ queryParams }) {
          const toolCallId = nanoid();
      
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showEmails',
                    toolCallId,
                    args: { queryParams },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showEmails',
                    toolCallId,
                    result: { queryParams },
                  },
                ],
              },
            ],
          });
      
          const items: MailType[] = await getEmails(queryParams);
      
          return (
            <BotCard>
              <p>Query parameters: {queryParams}</p>
              <MailListPage params={{ name: 'inbox' }} searchParams={{ queryParams }} />        
            </BotCard>
          );
        },
      },
      composeEmail: {
        description: 'Compose an email using provided information.',
        parameters: z.object({
          to: z.string().describe('Email address of the recipient'),
          subject: z.string().describe('Subject of the email'),
          body: z.string().describe('Body content of the email')
        }),
        generate: async function* ({ to, subject, body }) {
          const toolCallId = nanoid();
      
          const emailData = { to, subject, body };
      
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'composeEmail',
                    toolCallId,
                    args: emailData,
                  },
                ],
              },
            ],
          });
      
          const confirmationMessage = createStreamableUI(
            <BotCard>
              <ComposeEmail initialData={emailData} onSend={sendEmail} />
              <p>Here's the composed email. Review and click 'Send' when ready.</p>
            </BotCard>
          );
      
          return confirmationMessage.value;
        },
      },
    },
  });

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    sendComposedEmail
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = (await auth()) as EnrichedSession;

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.userId
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map((tool: any) => {
            switch (tool.toolName) {
              case 'showTasks':
              case 'addTasks':
              case 'deleteTasks':
                return (
                  <BotCard>
                    <TaskComboboxForm lists={[]} />
                  </BotCard>
                );
              case 'showEmails':
                return (
                  <BotCard>
                    <MailListPage params={{ name: 'inbox' }} searchParams={{ queryParams: tool.result.queryParams }} />
                  </BotCard>
                );
              default:
                return null;
            }
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}

export async function sendComposedEmail(emailData: { to: string; subject: string; body: string }) {
  'use server'

  const result = await sendEmail(emailData);

  if (result.success) {
    return {
      id: nanoid(),
      display: <BotCard>Email sent successfully!</BotCard>
    };
  } else {
    return {
      id: nanoid(),
      display: <BotCard>Failed to send email. Please try again.</BotCard>
    };
  }
}