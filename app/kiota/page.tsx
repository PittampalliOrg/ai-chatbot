import { AnonymousAuthenticationProvider, RequestInformation } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { createApiClient, ApiClient } from '@/kiota/apiClient';
import { auth, EnrichedSession } from '@/auth';

export function initializeGraphClient(accessToken: string): ApiClient {
  const authProvider = new AnonymousAuthenticationProvider();

  const requestAdapter = new FetchRequestAdapter(authProvider);
  return createApiClient(requestAdapter);
}


const page = async () => {
    const session = (await auth()) as EnrichedSession;
    const accessToken = session?.accessToken as string;

    const graphClient = initializeGraphClient(accessToken);

    const response = graphClient.me.mailFolders.get();

  return (
    <div>{JSON.stringify(response)}</div>
  )
}

export default page