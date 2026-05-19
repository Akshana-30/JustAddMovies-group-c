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
import { formSchema } from "@/lib/payment-schema";

interface DefaultAddress {
  street: string;
  city: string;
  state?: string | null;
  zipCode: string;
  country: string;
}



export default function PaymentForm({
  defaultAddress,
}: {
  defaultAddress?: DefaultAddress | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      card: "",
      expires: "",
      cvv: "",
      streetAddress: defaultAddress?.street ?? "",
      city: defaultAddress?.city ?? "",
      zip: defaultAddress?.zipCode ?? "",
      country: defaultAddress?.country ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          await handleCheckout(value);
          toast.success("Your order has been placed!", {
            position: "top-center",
          });
          router.push("/");
        } catch (err) {
          console.error("Checkout error:", err);
          toast.error(
            err instanceof Error
              ? err.message
              : "Checkout failed. Please try again.",
            { position: "top-center" },
          );
        }
      });
    },
  });

  function handleCartClick() {
    router.push("/cart");
  }

  return (
    <div className="w-full max-w-md">
      <Card className="max-lg:rounded-t-none lg:rounded-l-none border-r max-lg:border-l lg:border-t border-b border-(--gold)/30 bg-sidebar-accent/40 dark:bg-sidebar-accent/40">
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
              <form.Field name="name">
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
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
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
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="card">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  const formatCardNumber = (value: string) =>
                    value
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(.{4})/g, "$1 ")
                      .trim();
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Credit Card</FieldLabel>
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
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <div className="flex gap-12">
                <form.Field name="expires">
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
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="cvv">
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
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="streetAddress">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Street</FieldLabel>
                      <Input
                        className=" border-(--gold)/40"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Change your address in{" "}
                        <a
                          href="/admin-dashboard/dashboard/account"
                          className="underline"
                          style={{ color: "var(--gold)" }}
                        >
                          My Account
                        </a>
                      </p>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <div className="flex gap-12">
                <form.Field name="zip">
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
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="city">
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
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="country">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                        <Input
                          className=" border-(--gold)/40"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(ev) => field.handleChange(ev.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
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
