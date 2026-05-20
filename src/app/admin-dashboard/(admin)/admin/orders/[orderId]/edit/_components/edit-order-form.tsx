"use client";

import { useForm } from "@tanstack/react-form";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrder } from "../_actions/edit-order-actions";
import Link from "next/link";

type Movie = {
  title: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  movieId: string;
  orderId: string;
  movies: Movie;
};

type Order = {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  orderDate: Date;
  shippingStreet: string;
  shippingState: string | null;
  shippingZip: string;
  shippingCity: string;
  shippingCountry: string;
  user: {
    name: string;
  };
  orderItem: OrderItem[];
} | null;

type Props = {
  data: Order;
};

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number<number>().int().positive("Must be positive"),
  priceAtPurchase: z.coerce
    .number<number>()
    .int("Price must be an integer")
    .positive("Must be positive"),
  movieId: z.string(),
  orderId: z.string(),
  movies: z.object({
    title: z.string(),
  }),
});

export const formSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalAmount: z.coerce.number<number>().int("Price must be an integer"),
  status: z.string(),
  orderDate: z.iso.date(),
  user: z.string(),
  streetAddress: z.string().min(1, "Street is required"),
  zip: z.string().min(1, "Zip is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),

  orderItem: z.array(orderItemSchema),
});

export default function EditOrderForm({ data }: Props) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      id: data?.id ?? "",
      status: data?.status ?? "",
      totalAmount: data?.totalAmount ?? 0,
      orderDate: data?.orderDate?.toISOString().split("T")[0] ?? "",
      orderItem: data?.orderItem ?? [],
      user: data?.user?.name ?? "",
      userId: data?.userId ?? "",
      streetAddress: data?.shippingStreet ?? "",
      zip: data?.shippingZip ?? "",
      city: data?.shippingCity ?? "",
      country: data?.shippingCountry ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await updateOrder(value);
      console.log(value);
      toast.success("Order was successfully updated.", {
        position: "bottom-right",
      });
      router.push(`/admin-dashboard/admin/orders`);
    },
  });

  return (
    <div className="max-w-3xl border border-(--gold)/30 bg-sidebar-accent/40 p-5 rounded-2xl">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          form.handleSubmit(ev);
        }}
      >
        <FieldGroup>
          <form.Field name="id">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Order ID</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    aria-invalid={isInvalid}
                    disabled
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="userId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>User ID</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    aria-invalid={isInvalid}
                    disabled
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="orderDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Order Date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={String(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="status">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="totalAmount">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Total Order Cost</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(ev) =>
                      field.handleChange(Number(ev.target.value))
                    }
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="orderItem" mode="array">
            {(field) => (
              <div className="space-y-4">
                {field.state.value.map((item, index) => (
                  <div
                    key={item.id}
                    className="space-y-4 p-4 border border-(--gold)/30 "
                  >
                    <form.Field name={`orderItem[${index}].quantity`}>
                      {(subField) => (
                        <Field>
                          <FieldLabel>Quantity</FieldLabel>
                          <Input
                            type="number"
                            value={subField.state.value ?? 0}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                              subField.handleChange(Number(e.target.value))
                            }
                          />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name={`orderItem[${index}].priceAtPurchase`}>
                      {(subField) => (
                        <Field>
                          <FieldLabel>Price</FieldLabel>
                          <Input
                            type="number"
                            value={subField.state.value ?? 0}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                              subField.handleChange(Number(e.target.value))
                            }
                          />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name={`orderItem[${index}].movies.title`}>
                      {(subField) => (
                        <Field>
                          <FieldLabel>Movie</FieldLabel>
                          <Input value={subField.state.value ?? ""} disabled />
                        </Field>
                      )}
                    </form.Field>

                    <Button
                      type="button"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => field.removeValue(index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </form.Field>

          <div className="space-y-4 p-4 border border-(--gold)/30 ">
            <p>Delivery details</p>

            <form.Field name="streetAddress">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="flex-1 pb-2">
                    <FieldLabel htmlFor={field.name}>Street</FieldLabel>
                    <Input
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

            <div className="flex gap-12">
              <form.Field name="zip">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex-1">
                      <FieldLabel htmlFor={field.name}>Zip</FieldLabel>
                      <Input
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
          </div>

          <Field orientation="horizontal">
            <Button
              className="cursor-pointer bg(--gold)] hover:bg-(--gold)]/85"
              type="submit"
            >
              Submit
            </Button>
            <Button
              className="cursor-pointer"
              type="reset"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin-dashboard/admin/orders">Back to orders</Link>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
