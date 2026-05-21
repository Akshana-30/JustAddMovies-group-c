"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { setCooldown, useCooldown } from "../../_helpers/auth-action-cooldown";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function VerifyEmailForm() {
    const { countdown, setCountdown } = useCooldown();
    const [loading, setLoading] = useState(false);

    async function HandleClick() {
        const email = localStorage.getItem('session_email');

        if(!email) {
            toast.error("Email not found. Please log in again.");
            return;
        }

        setLoading(true);

        const { error } = await authClient.sendVerificationEmail({
            email: email ?? "",
            callbackURL: "/",
        });

        setLoading(false);

        if (error) {
            toast.error(error.message || "An unknown error occurred", {
                position: "top-center",
            });
            
            return;
        }

        toast.success("Verification link sent successfully", {
            description: `Please check your email (including the spam folder).
            The link will expire in 30 minutes.`,
            duration: 7000,
            position: "top-center",
        })

        setCooldown();
        setCountdown(30);
    }

    return (
        <Button 
            className="w-full" 
            onClick={HandleClick} 
            disabled={countdown > 0 || loading}
            suppressHydrationWarning
        >
            {loading ? (
                <>
                    <Spinner data-icon="inline-start" />
                    Loading
                </>
            ) : (
                `${countdown > 0 ? `Wait ${countdown}s` : "Request Verification Link"}`
            )}
        </Button>
    )
}