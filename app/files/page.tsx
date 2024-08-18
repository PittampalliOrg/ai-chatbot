import FilesList from "@/components/graph-files";
import { auth, EnrichedSession } from '@/auth'

export default async function ProfilePage() {
    const session = (await auth()) as EnrichedSession
  const accessToken = session?.accessToken as string;

  return (
  <>
    <FilesList accessToken={accessToken} />
  </>
  );
}