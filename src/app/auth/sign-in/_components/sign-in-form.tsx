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
import { formSchema } from "@/app/auth/_components/form-schema";
import { ErrorAlert } from "@/app/auth/_components/error-alert";
import { InputFields } from "../../_components/input-fields";

export function SignInForm() {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },

        validators: {
            onSubmit: formSchema,
        },

        onSubmit: async ({ value }) => {
            const { error } = await authClient.signIn.email({
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
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        id="sign-in-form"
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

                            <form.Field name="password">
                                {field => (
                                    <InputFields
                                        field={field}
                                        label="Password"
                                        type="password"
                                        autocomplete="new-password"
                                    />
                                )}
                            </form.Field>

                            <Field>
                                <Button type="submit">Login</Button>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/auth/register">Sign Up</Link>
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