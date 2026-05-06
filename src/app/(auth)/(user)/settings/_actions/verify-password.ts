"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function verifyUserPassword(password: string) {
    const response = await auth.api.verifyPassword({
        body: { password },
        headers: await headers(),
    });

    return response.status;
}