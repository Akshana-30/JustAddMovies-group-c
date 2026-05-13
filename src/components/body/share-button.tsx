"use client";

import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button> & {
    movieId?: string;
};

export function ShareButton({
    movieId,
    ...props
}: ButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
            if (typeof window !== "undefined") {
                const currentUrl = window.location.href;
                const url = movieId && !currentUrl.includes(movieId)
                    ? `${currentUrl}/${movieId}`
                    : currentUrl;

                await navigator.clipboard.writeText(url);

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        });
    }

    return (
        <Button
            disabled={isPending}
            onClick={handleCopy}
            {...props}
        >
            <div className="relative h-4 w-4">
                <Copy
                    className={`absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out ${copied
                        ? 'scale-0 opacity-0 rotate-45'
                        : 'scale-100 opacity-100 rotate-0'
                        }`}
                />

                <Check
                    className={`absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out ${copied
                        ? 'scale-100 opacity-100 rotate-0'
                        : 'scale-0 opacity-0 -rotate-45'
                        }`}
                />
            </div>
        </Button>
    )
}