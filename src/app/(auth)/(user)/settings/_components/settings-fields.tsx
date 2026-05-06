"use client";

import { InputFields } from "@/app/(auth)/_components/input-fields";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSet
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { settingsSchema } from "@/app/(auth)/_helpers/form-schema";
import { verifyUserPassword } from "../_actions/verify-password";
import { useRouter } from "next/navigation";

export function SettingsFields() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [askForPassword, setAskForPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            name: session?.user.name ?? "",
            email: session?.user.email ?? "",
            password: "",
            currentPassword: "",
            confirmPassword: "",
        },

        validators: {
            onChange: settingsSchema,
        },

        onSubmit: async ({ value }) => {
            if (value.name !== (session?.user.name)) {
                const { error } = await authClient.updateUser({
                    name: value.name,
                });

                if (error) {
                    return toast.error(error.message || "An unknown error occurred", {
                        position: "top-center",
                    });
                }

                toast.success("Name updated!", {
                    position: "top-center"
                });
            }

            const emailChanged = value.email !== (session?.user.email);
            const passwordChanged = value.password !== "";

            if (emailChanged || passwordChanged) {
                value.currentPassword = "";
                setAskForPassword(true);
            }
        }
    });

    const handleSecureUpdate = async () => {
        const { email, password, currentPassword } = form.state.values;

        if (password !== "" && password === currentPassword) {
            return form.setFieldMeta("currentPassword", prev => ({
                ...prev,
                isTouched: true,
                errorMap: {
                    onServer: "New password cannot be same as current",
                },
            }));
        }

        try {
            await verifyUserPassword(currentPassword);

        } catch (e) {
            if (String(e).includes("Invalid password")) {
                return form.setFieldMeta("currentPassword", prev => ({
                    ...prev,
                    isTouched: true,
                    errorMap: {
                        onServer: "Incorrect password",
                    },
                }));
            }

            return toast.error("An unknown error occurred", {
                position: "top-center",
            });
        }

        setAskForPassword(false);

        if (email !== session?.user.email) {
            const { error } = await authClient.changeEmail({
                newEmail: email ?? "",
                callbackURL: "/settings"
            });

            if (error) {
                return toast.error(error.message || "An unknown error occurred", {
                    position: "top-center",
                });
            }
        }

        if (password !== "") {
            const { error } = await authClient.changePassword({
                newPassword: password,
                currentPassword: currentPassword,
                revokeOtherSessions: true,
            })

            if (error) {
                return toast.error(error.message || "An unknown error occurred", {
                    position: "top-center",
                });
            }
        }

        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                }
            }
        })

        toast.success("Changes applied successfully. If you changed your email, check the mail we sent to proceed.", {
            position: "top-center",
            duration: 10000,
        });
    }

    const handleSyncChange = (name: "currentPassword", value: string) => {
        form.setFieldMeta("currentPassword", prev => ({
            ...prev,
            errorMap: {
                onServer: undefined,
            }
        }));

        form.setFieldValue(name, value);
    }

    if (isPending)
        return <div>Loading settings...</div>;

    return (
        <>
            <Dialog open={askForPassword} onOpenChange={setAskForPassword}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Enter your current password</DialogTitle>

                        <DialogDescription>
                            To submit your changes, you need to enter your current password
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <form.Field name="currentPassword">
                            {field => (
                                <InputFields
                                    field={field}
                                    label="Enter your password"
                                    onChange={val => handleSyncChange("currentPassword", val)}
                                    type={showPassword ? "text" : "password"}
                                    isPassword={true}
                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                    showPassword={showPassword}
                                />
                            )}
                        </form.Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            variant="outline"
                            type="submit"
                            onClick={handleSecureUpdate}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <FieldSet className="gap-6">
                <FieldLegend>User</FieldLegend>

                <FieldDescription>Settings regarding user account</FieldDescription>
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
                                    label="Full name"
                                    type="text"
                                    autocomplete="name"
                                    placeholder={session?.user.name || ""}
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
                                    placeholder={session?.user.email || ""}
                                />
                            )}
                        </form.Field>

                        <form.Field name="password">
                            {field => (
                                <InputFields
                                    field={field}
                                    label="New password"
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
                    </FieldGroup>

                    <form.Subscribe
                        selector={state => [state.isDefaultValue, state.canSubmit, state.isDirty, state.isSubmitting]}
                    >
                        {([isDefaultValue, canSubmit, isDirty, isSubmitting]) => (
                            <Button
                                suppressHydrationWarning
                                type="submit"
                                variant="outline"
                                className="w-1/3 mx-auto mt-6"
                                disabled={isDefaultValue || !isDirty || !canSubmit || isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </FieldSet>
        </>
    );
}