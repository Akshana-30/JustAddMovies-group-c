import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AnyFieldApi } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface InputFieldsProps {
    field: AnyFieldApi;
    label: string;
    type?: string;
    autocomplete?: string;
    placeholder?: string;
    required?: boolean;
    resetPassword?: boolean;
    onChange?: (value: string) => void;
    isPassword?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

export function InputFields({
    field,
    label,
    type,
    autocomplete,
    placeholder,
    required,
    resetPassword,
    onChange,
    isPassword,
    showPassword,
    onTogglePassword,
}: InputFieldsProps) {
    const fieldErrors = field.state.meta.errors;
    const serverError = field.state.meta.errorMap?.onServer;

    const activeErrors = serverError
        ? [{ message: String(serverError) }]
        : fieldErrors;

    const isInvalid =
        field.state.meta.isTouched &&
        !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <div className="relative">
                <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={ev => {
                        const val = ev.target.value;

                        if (onChange) {
                            onChange(val);
                        } else {
                            field.handleChange(val)
                        }

                    }}
                    aria-invalid={isInvalid}
                    type={type}
                    className={isPassword ? "pr-10" : ""}
                    autoComplete={autocomplete}
                    placeholder={placeholder}
                    required={required}
                />

                {isPassword && onTogglePassword && (
                    <Button
                        type="button"
                        onClick={onTogglePassword}
                        className="
                            absolute 
                            right-0 
                            top-0 
                            h-full 
                            w-10 
                            flex 
                            items-center 
                            justify-center 
                            bg-transparent 
                            border-none 
                            p-0 
                            outline-none 
                            text-muted-foreground 
                            hover:text-foreground 
                            transition-all 
                            active:scale-95
                        "
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                )}
            </div>

            {isInvalid && (
                <FieldError errors={activeErrors} />
            )}

            {resetPassword && (
                <Link
                    href="/reset-password"
                    className="text-sm underline-offset-4 hover:underline text-foreground hover:text-foreground block text-right"
                >
                    Forgot your password?
                </Link>
            )}
        </Field>
    );
}