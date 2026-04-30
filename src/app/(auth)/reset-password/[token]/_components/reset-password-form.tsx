"use client";

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
import { useRouter } from "next/navigation";
import { formSchema } from "@/app/(auth)/_helpers/form-schema";
import { InputFields } from "../../../_components/input-fields";
import z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        } as z.input<typeof formSchema>,

        validators: {
            onSubmit: formSchema,
            onChange: formSchema,
        },

        onSubmit: async ({ value }) => {
            setLoading(true);

            const { error } = await authClient.resetPassword({
                newPassword: value.password ?? "",
                token,
            });

            setLoading(false);

            if (error) {
                toast.error(error.message || "An unknown error occurred", {
                    position: "top-center",
                });

                return;
            }

            toast.success("Password was reset successfully", {
                description: "You will be sent back to the sign-in page",
                position: "top-center",
                duration: 10000,
                onAutoClose: () => {
                    router.push("/sign-in");
                },
            });
        },
    });

    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Password reset</CardTitle>

                    <CardDescription>
                        Fill in the forms below to reset your password.
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
                            <form.Field name="password">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        isPassword={true}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                        showPassword={showPassword}
                                        autocomplete="new-password"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="confirmPassword">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Confirm password"
                                        type={showPassword ? "text" : "password"}
                                        isPassword={true}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                        showPassword={showPassword}
                                    />
                                )}
                            </form.Field>

                            <Field>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner data-icon="inline-start" />
                                            Loading
                                        </>
                                    ) : (
                                        "Submit"
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