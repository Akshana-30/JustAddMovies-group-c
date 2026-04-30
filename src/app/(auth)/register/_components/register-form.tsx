"use client";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formSchema } from "@/app/(auth)/_helpers/form-schema";
import { InputFields } from "../../_components/input-fields";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        } as z.input<typeof formSchema>,

        validators: {
            onSubmit: formSchema,
            onChange: formSchema,
        },

        onSubmit: async ({ value }) => {
            setLoading(true);

            const { error } = await authClient.signUp.email({
                name: value.name ?? "",
                email: value.email ?? "",
                password: value.password ?? "",
            });

            setLoading(false);

            if (error) {
                toast.error(error.message || "An unknown error occurred", {
                    position: "top-center",
                });
                
                return;
            }
            
            toast.info("Check your email", {
                description: `We sent a verification link to provided email.
                The link will expire in 30 minutes.`,
                duration: 10000,
                position: "top-center",
            });
        },
    });

    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Register</CardTitle>

                    <CardDescription>
                        Fill out the form below to register an account
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
                            <form.Field name="name">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Name"
                                        type="text"
                                        autocomplete="name"
                                    />
                                )}
                            </form.Field>

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
                                    className="w-full" 
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner data-icon="inline-start" />
                                            Loading
                                        </>
                                    ) : (
                                        "Register"
                                    )}
                                </Button>

                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link href="/sign-in">Sign In</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking register,
                you agree to our&nbsp;
                <Link href="#">Terms of Service</Link>
                &nbsp;and <Link href="#">Privacy Policy</Link>
            </FieldDescription>
        </>
    );
}