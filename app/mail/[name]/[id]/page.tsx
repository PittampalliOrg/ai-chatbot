import { MailDisplay } from "@/app/mail/components/mail-display"

export default function MailDisplayPage({ params }: { params: { name: string, id: string } }) {
  return (
    <div className="h-full bg-background">
      <MailDisplay emailId={params.id} />
    </div>
  )
}