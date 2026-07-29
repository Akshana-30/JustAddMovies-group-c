import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "https://just-add-movies-group-c-woad.vercel.app/",
    plugins: [
        adminClient(),
    ]
});