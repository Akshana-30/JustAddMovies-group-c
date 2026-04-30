"use client";

import dynamic from "next/dynamic"

const ResetEmailForm = dynamic(
    () => import("../_components/reset-email-form")
    .then(mod => mod.ResetEmailForm),
    { ssr: false }
);

export const ResetEmailClient = () => (
    <ResetEmailForm />
)