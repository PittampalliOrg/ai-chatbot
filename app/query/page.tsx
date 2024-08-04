import { auth, EnrichedSession } from 'auth';
import { Session } from 'inspector';

export default async function Page() {
  const session = Session
 
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
