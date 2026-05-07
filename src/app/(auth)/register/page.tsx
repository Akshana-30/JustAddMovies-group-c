import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "./_components/register-form";

export default async function RegisterPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session) redirect("/");

    return (
        <div className="w-full max-w-md mt-10 mx-auto px-4">
            <RegisterForm />
        </div>
    )
}