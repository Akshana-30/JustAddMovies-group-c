import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResetEmailClient } from "./_components/reset-email-client";

export default async function ResetPasswordPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) redirect("/");

    return (
        <div className="w-2/5 mt-5 mx-auto">
            <ResetEmailClient />
        </div>
    );
}