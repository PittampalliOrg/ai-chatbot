import { auth, EnrichedSession } from '@/auth';
import { AccountSwitcherWrapper } from './account-switcher-wrapper';

interface AccountSwitcherServerProps {
  isCollapsed: boolean;
}

export async function AccountSwitcherServer({ isCollapsed }: AccountSwitcherServerProps) {
  const session = (await auth()) as EnrichedSession;

  const currentAccount = {
    label: session?.user?.name || "Current User",
    email: session?.user?.email || "",
    image: session?.user?.image || "",
  };

  return <AccountSwitcherWrapper currentAccount={currentAccount} isCollapsed={isCollapsed} />;
}