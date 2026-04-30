"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);

        const { error } = await authClient.signOut();

        setLoading(false);

        if(error) {
            toast.error(error.message || "An unknown error occurred", {
                position: "top-center",
            });

            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <Button
            variant="ghost"
            size="lg"
            disabled={loading}
            onClick={handleClick}
        >
            {loading ? (
                <>
                    <Spinner data-icon="inline-start" />
                    Loading
                </>
            ) : (
                "Sign Out"
            )}
        </Button>
    );
}