import UserProfile from "@/components/user-profile";
import { auth, EnrichedSession } from '@/auth'
import { Todo } from "@microsoft/mgt-react";

export default async function ProfilePage() {
    const session = (await auth()) as EnrichedSession
  const accessToken = session?.accessToken as string;

  return (
  <>
    <UserProfile accessToken={accessToken} />
    
  </>
  );
}