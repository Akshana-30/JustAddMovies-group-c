"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputFields } from "../../_components/input-fields";
import { setEmail } from "../../_helpers/session-email-storage";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function SignInForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        
        onSubmit: async ({ value }) => {
            setLoading(true);

            const { error } = await authClient.signIn.email({
                email: value.email,
                password: value.password,
                callbackURL: "/",
            });

            setLoading(false);

            if (error) {
                if (error?.code === "INVALID_EMAIL_OR_PASSWORD" ||
                    error?.code === "INVALID_EMAIL"
                ) {
                    form.setFieldMeta("email", prev => ({
                        ...prev,
                        isTouched: true,
                        errorMap: {
                            onServer: "",
                        }
                    }));

                    form.setFieldMeta("password", prev => ({
                        ...prev,
                        isTouched: true,
                        errorMap: {
                            onServer: "Invalid email or password",
                        }
                    }));

                    return;
                }

                if (error?.code === "EMAIL_NOT_VERIFIED") {
                    setEmail(value.email ?? "");
                    router.push("/verify-email");
                    return;
                }

                toast.error(error.message || "An unknown error occurred", {
                    position: "top-center",
                });

                return;
            }

            router.refresh();
        },
    });

    useEffect(() => {
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

        if (emailInput?.value) form.setFieldValue("email", emailInput.value);
        if (passwordInput?.value) form.setFieldValue("password", passwordInput.value);
    }, [form]);

    const handleSyncChange = (name: "email" | "password", value: string) => {
        form.setFieldMeta("email", prev => ({
            ...prev,
            errorMap: {
                onServer: undefined,
            }
        }));

        form.setFieldMeta("password", prev => ({
            ...prev,
            errorMap: {
                onServer: undefined,
            }
        }));

        form.setFieldValue(name, value);
    }

    return (
        <>
            <Card className="mb-6">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
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
                                        onChange={val => handleSyncChange("email", val)}
                                        type="email"
                                        autocomplete="email"
                                        placeholder="email@example.com"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="password">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Password"
                                        onChange={val => handleSyncChange("password", val)}
                                        type={showPassword ? "text" : "password"}
                                        isPassword={true}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                        showPassword={showPassword}
                                        autocomplete="new-password"
                                        resetPassword
                                    />
                                )}
                            </form.Field>

                            <Field>
                                <Button
                                    className="w-full bg-[var(--gold)] text-black hover:bg-[var(--gold)]/85 hover:text-black"
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner data-icon="inline-start" />
                                            Loading
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register">Sign Up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking login,
                you agree to our&nbsp;
                <Link href="#">Terms of Service</Link>
                &nbsp;and <Link href="#">Privacy Policy</Link>
            </FieldDescription>
        </>
    );
}