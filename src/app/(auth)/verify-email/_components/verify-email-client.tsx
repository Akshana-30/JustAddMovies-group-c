"use client";

import dynamic from "next/dynamic";

const VerifyEmailForm = dynamic(
    () => import("../_components/verify-email-form")
    .then(mod => mod.VerifyEmailForm),
    { ssr: false }
);

export const VerifyEmailClient = () => (
    <VerifyEmailForm />
)
