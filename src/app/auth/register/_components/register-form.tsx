"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { formSchema } from "@/app/auth/_components/form-schema";
import { ErrorAlert } from "@/app/auth/_components/error-alert";
import { InputFields } from "../../_components/input-fields";

const registerSchema = formSchema.extend({
    name: z.string().min(1, "Name is required").max(32)
})

export function RegisterForm() {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },

        validators: {
            onSubmit: registerSchema,
        },

        onSubmit: async ({ value }) => {
            const { error } = await authClient.signUp.email({
                name: value.name,
                email: value.email,
                password: value.password,
            });

            if (error) {
                <ErrorAlert error={error} />

                return;
            }

            router.push("/");
            router.refresh();
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
                        id="register-form"
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
                                        required
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
                                        required
                                    />
                                )}
                            </form.Field>

                            <form.Field name="password">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Password"
                                        type="password"
                                        autocomplete="new-password"
                                        required
                                    />
                                )}
                            </form.Field>

                            <Field>
                                <Button className="w-full" form="register-form">
                                    Register
                                </Button>

                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link href="/auth/sign-in">Sign In</Link>
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