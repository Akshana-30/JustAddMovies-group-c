"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { formSchema } from "@/app/(auth)/_helpers/form-schema";
import { InputFields } from "../../_components/input-fields";
import z from "zod";
import { setCooldown, useCooldown } from "../../_helpers/auth-action-cooldown";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ResetEmailForm() {
    const { countdown, setCountdown } = useCooldown();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            email: "",
        } as z.input<typeof formSchema>,

        validators: {
            onSubmit: formSchema,
        },

        onSubmit: async ({ value }) => {
            setLoading(true);

            const { error } = await authClient.requestPasswordReset({
                email: value.email ?? "",
                redirectTo: "/reset-password",
            });

            setLoading(false);

            if (error) {
                toast.error(error.message || "An unknown error occurred", {
                    position: "top-center",
                });
                
                return;
            }

            toast.info("Check your email", {
                description: `If an account exists for that email, we've sent a reset link`,
                duration: 10000,
                position: "top-center",
            });
            setCooldown();
            setCountdown(60);
        },
    });

    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Reset password request</CardTitle>

                    <CardDescription>
                        Fill in with your email below to request a reset password link
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={ev => {
                            ev.preventDefault();
                            form.handleSubmit(ev);
                        }}
                    >
                        <FieldGroup>
                            <form.Field name="email">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Email"
                                        type="email"
                                        autocomplete="email"
                                        placeholder="email@example.com"
                                    />
                                )}
                            </form.Field>

                            <Field>
                                <Button 
                                    className="w-full" 
                                    type="submit" 
                                    disabled={countdown > 0 || loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner data-icon="inline-start" />
                                            Loading
                                        </>
                                    ) : (
                                        `${countdown > 0 ? `Wait ${countdown}s` : "Submit"}`
                                    )}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}