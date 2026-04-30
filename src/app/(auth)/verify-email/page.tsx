import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import { auth } from "@/lib/auth";
import { TriangleAlert } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { VerifyEmailClient } from "./_components/verify-email-client";

export default async function VerifyEmailPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) redirect("/");

    return (
        <div className="max-w-md mx-auto space-y-4">
            <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                <TriangleAlert />

                <AlertTitle>Verify Email</AlertTitle>

                <AlertDescription>
                    Please verify your email before signing in
                </AlertDescription>
            </Alert>

            <VerifyEmailClient />
        </div>
    );
}