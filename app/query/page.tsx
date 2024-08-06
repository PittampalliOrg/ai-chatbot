import { auth, EnrichedSession } from 'auth';

export default async function Page() {
  const session = (await auth()) as EnrichedSession
 
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
