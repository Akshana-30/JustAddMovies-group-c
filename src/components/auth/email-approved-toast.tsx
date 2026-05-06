"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function EmailApprovedToast() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get("email_approval") === "success") {
            toast.info("Approval successful. Please verify your new email to proceed.", {
                position: "top-center",
                duration: 10000
            });

            const params = new URLSearchParams(searchParams);
            params.delete("email_approval");
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    return null;
}