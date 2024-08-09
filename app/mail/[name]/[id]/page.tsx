import { MailDisplay } from "@/app/mail/components/mail-display"

export default function MailDisplayPage({ params }: { params: { name: string, id: string } }) {
  return <MailDisplay emailId={params.id} />
}