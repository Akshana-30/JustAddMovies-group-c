import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "./_components/sign-in-form";

export default async function SignInPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session) redirect("/");

    return (
        <div className="w-2/5 mt-5 mx-auto">
            <SignInForm />
        </div>
    );
}