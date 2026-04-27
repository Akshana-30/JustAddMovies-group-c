import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AnyFieldApi } from "@tanstack/react-form";

interface InputFieldsProps {
    field: AnyFieldApi;
    label: string;
    type?: string;
    autocomplete?: string;
    placeholder?:  string;
    required?: boolean;
}

export function InputFields({ 
    field, 
    label,
    type,
    autocomplete,  
    placeholder,
    required 
}: InputFieldsProps) {
    const isInvalid =
        field.state.meta.isTouched &&
        !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={ev =>
                    field.handleChange(ev.target.value)
                }
                aria-invalid={isInvalid}
                type={type}
                autoComplete={autocomplete}
                placeholder={placeholder}
                required={required}
            />

            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    );
}