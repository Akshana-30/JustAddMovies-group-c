"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import handleCheckout from "./handleCheckout";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function PaymentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      card: "",
      expires: "",
      cvv: "",
      streetAdress: "",
      city: "",
      zip: "",
    },
    onSubmit: async () => {
      startTransition(() => handleCheckoutClick());
    },
  });

  async function handleCheckoutClick() {
    const { streetAdress, city, zip } = form.state.values;
    try {
      await handleCheckout({ street: streetAdress, city, zip });
      toast.success("Your order has been placed!", {
        position: "top-center",
      });
      router.push("/");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(
        err instanceof Error ? err.message : "Checkout failed. Please try again.",
        { position: "top-center" }
      );
    }
  }

  function handleCartClick() {
    router.push("/cart");
  }
  
  return (

    <div className="w-full max-w-md ">
      <Card className="rounded-l-none border-r border-t border-b border-(--gold)/30 bg-sidebar-accent dark:bg-sidebar-accent/60">
        <CardHeader>
          <CardTitle>
            Payment Details
            <CardDescription></CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              form.handleSubmit(ev);
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Name is required";
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                      className=" border-(--gold)/40"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                      />
                      {isInvalid && (
                        <FieldError
                          id={`${field.name}-error`}
                          errors={field.state.meta.errors.map((e) => ({
                            message: String(e),
                          }))}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Email is required";
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                      className=" border-(--gold)/40"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                        type="email"
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                      />
                      {isInvalid && (
                        <FieldError
                          id={`${field.name}-error`}
                          errors={field.state.meta.errors.map((e) => ({
                            message: String(e),
                          }))}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="card"
                validators={{
                  onChange: ({ value }) => {
                    const digits = value.replace(/\s/g, "");
                    if (!digits) return "Card number is required";
                    if (!/^\d+$/.test(digits))
                      return "Card number must contain only digits";
                    if (digits.length < 13 || digits.length > 16)
                      return "Enter a valid card number";
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  const formatCardNumber = (value: string) =>
                    value
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(.{4})/g, "$1 ")
                      .trim();

                  const detectCardType = (value: string) => {
                    const n = value.replace(/\s/g, "");
                    if (/^4/.test(n)) return "Visa";
                    if (/^5[1-5]/.test(n)) return "Mastercard";
                    if (/^3[47]/.test(n)) return "Amex";
                    if (/^6/.test(n)) return "Discover";
                    return null;
                  };

                  const cardType = detectCardType(field.state.value ?? "");

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Credit Card
                        {cardType && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontWeight: 400,
                              opacity: 0.7,
                            }}
                          >
                            · {cardType}
                          </span>
                        )}
                      </FieldLabel>
                      <Input
                      className=" border-(--gold)/40"
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(ev) =>
                          field.handleChange(formatCardNumber(ev.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        maxLength={19}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                      />
                      {isInvalid && (
                        <FieldError
                          id={`${field.name}-error`}
                          errors={field.state.meta.errors.map((e) => ({
                            message: String(e),
                          }))}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <div className="flex gap-12">
                <form.Field
                  name="expires"
                  validators={{
                    onChange: ({ value }) => {
                      const now = new Date();
                      if (!value) return "Expiry is required";
                      if (!/^\d{2}\/\d{2}$/.test(value))
                        return "Use MM/YY format";
                      const [mm, yy] = value.split("/").map(Number);
                      const currentYY = now.getFullYear() % 100;
                      if (mm < 1 || mm > 12) return "Invalid month";
                      if(yy > currentYY + 5) return "Invalid year";
                      const expDate = new Date(2000 + yy, mm - 1, 1);
                      if (
                        expDate < new Date(now.getFullYear(), now.getMonth(), 1)
                      )
                        return "Card has expired";
                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    const formatExpiry = (value: string) => {
                      const digits = value.replace(/\D/g, "").slice(0, 4);
                      return digits.length >= 3
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits;
                    };

                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor={field.name}>Expiry</FieldLabel>
                        <Input
                        className=" border-(--gold)/40"
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(ev) =>
                            field.handleChange(formatExpiry(ev.target.value))
                          }
                          placeholder="MM/YY"
                          inputMode="numeric"
                          maxLength={5}
                          aria-invalid={isInvalid}
                          aria-describedby={
                            isInvalid ? `${field.name}-error` : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors.map((e) => ({
                              message: String(e),
                            }))}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="cvv"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "CVV is required";
                      if (!/^\d+$/.test(value)) return "CVV must be numeric";
                      if (value.length < 3 || value.length > 4)
                        return "CVV must be 3 or 4 digits";
                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor={field.name}>CVV</FieldLabel>
                        <Input
                        className=" border-(--gold)/40"
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(ev) =>
                            field.handleChange(
                              ev.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          placeholder="123"
                          inputMode="numeric"
                          maxLength={4}
                          type="password"
                          aria-invalid={isInvalid}
                          aria-describedby={
                            isInvalid ? `${field.name}-error` : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors.map((e) => ({
                              message: String(e),
                            }))}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
              <form.Field
                name="streetAdress"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Street is required";
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Street Adress
                      </FieldLabel>
                      <Input
                      className=" border-(--gold)/40"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                      />
                      {isInvalid && (
                        <FieldError
                          id={`${field.name}-error`}
                          errors={field.state.meta.errors.map((e) => ({
                            message: String(e),
                          }))}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <div className="flex gap-12">
                <form.Field
                  name="city"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "City is required";
                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor={field.name}>City</FieldLabel>
                        <Input
                        className=" border-(--gold)/40"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(ev) => field.handleChange(ev.target.value)}
                          aria-invalid={isInvalid}
                          aria-describedby={
                            isInvalid ? `${field.name}-error` : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors.map((e) => ({
                              message: String(e),
                            }))}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field
                  name="zip"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Zip is required";
                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor={field.name}>Zip</FieldLabel>
                        <Input
                        className=" border-(--gold)/40"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(ev) => field.handleChange(ev.target.value)}
                          aria-invalid={isInvalid}
                          aria-describedby={
                            isInvalid ? `${field.name}-error` : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors.map((e) => ({
                              message: String(e),
                            }))}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <Button
              type="submit"
              className="cursor-pointer w-full mt-4 bg-(--gold) hover:bg-(--gold)]/85"
              disabled={isPending}
            >
              {isPending ? "Validating payment.." : "Checkout"}
            </Button>
          </form>

          <Button
            type="button"
            className="cursor-pointer w-full mt-4 bg-neutral-400! hover:bg-neutral-400/85!"
            onClick={handleCartClick}
            disabled={isPending}
          >
            Back To Cart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
