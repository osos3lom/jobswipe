import { jobs } from '@/lib/data'
import { ChatConversationView } from '@/components/chat-conversation-view'

export function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }))
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ChatConversationView id={id} />
}
