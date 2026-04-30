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
        <div className="w-2/5 mt-5 mx-auto">
            <RegisterForm />
        </div>
    )
}