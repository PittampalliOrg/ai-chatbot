import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat/chat'
import { AI } from '@/app/(chat)/actions'
import { auth, EnrichedSession } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'

export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as EnrichedSession
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: []}}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}