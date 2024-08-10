// app/kiota/nextAuthProvider.ts

import { AuthenticationProvider, RequestInformation } from "@microsoft/kiota-abstractions";
import { auth } from '@/auth';  // Import your NextAuth auth function
import { EnrichedSession } from '@/auth';  // Import your custom Session type

export class NextAuthAuthProvider implements AuthenticationProvider {
    async getAuthorizationToken(url?: string, additionalAuthenticationContext?: Record<string, unknown>): Promise<string> {
        const session = await auth() as EnrichedSession | null;
        return session?.accessToken || "";
    }

    async authenticateRequest(request: RequestInformation, additionalAuthenticationContext?: Record<string, unknown>): Promise<void> {
        const token = await this.getAuthorizationToken(request.URL);
        if (token) {
            request.headers.set('Authorization', new Set([`Bearer ${token}`]));
        }
    }
}