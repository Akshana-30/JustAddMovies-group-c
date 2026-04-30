import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./_components/reset-password-form";

type ParamProps = {
    params: Promise<{ token: string }>;
} 

export default async function NewPasswordPage({ params }: ParamProps) {
    const { token } = await params;
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) redirect("/");

    if (!token)
        redirect("/sign-in");

    return (
        <div className="w-2/5 mt-5 mx-auto">
            <ResetPasswordForm token={token} />
        </div>
    );
}