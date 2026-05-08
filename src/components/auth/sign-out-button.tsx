"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type Props = React.ComponentProps<typeof Button>;

export function SignOutButton({
    children,
    disabled,
    ...props
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);

        const { error } = await authClient.signOut();

        setLoading(false);

        if(error) {
            return toast.error(error.message || "An unknown error occurred", {
                position: "top-center",
            });
        }

        router.push("/");
        router.refresh();
    }

    return (
        <Button
            disabled={loading || disabled}
            onClick={handleClick}
            {...props}
        >
            {loading ? (
                <>
                    <Spinner data-icon="inline-start" />
                    Loading
                </>
            ) : (
                children || "Logout"
            )}
        </Button>
    );
}