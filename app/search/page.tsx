import SearchResults from "@/components/search-graph";
import { auth, EnrichedSession } from '@/auth'
import ThemeToggle from '@/components/theme-toggle-graph';


export default async function SearchPage() {
    const session = (await auth()) as EnrichedSession
    const accessToken = session?.accessToken as string;

    return (
        <>
            <ThemeToggle accessToken={accessToken}/>
            <SearchResults accessToken={accessToken} entityTypes={['driveItem']} fetchThumbnail={true} queryString="contoso"></SearchResults>
        </>
    );
}