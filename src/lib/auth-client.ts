import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// No baseURL: better-auth's client defaults to the page's own origin, so this
// correctly targets localhost in dev and the real deployment in production
// without hardcoding either. (Hardcoding the prod URL here previously meant
// every auth call from a local dev browser was a cross-origin request to
// production, which CORS silently killed as "Failed to fetch".)
export const authClient = createAuthClient({    
    plugins: [
        adminClient(),
    ]
});
