import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";
import { SettingsFields } from "./_components/settings-fields";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");

    return (
        <div className="flex flex-col items-center mx-auto w-1/2">
            <div className="bg-accent w-2/3 xl:w-1/2 border rounded-lg p-6">
                <SettingsFields />
            </div>
        </div>
    )
}