// src/app/contact/ContactForm.tsx
"use client";

import { z } from "zod";
import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { contactSchema } from "./_schemas/contact";
import { useForm } from "@tanstack/react-form";
import { createMessage } from "./_actions/contact-actions";
import { setCooldown, useCooldown } from "../(auth)/_helpers/auth-action-cooldown";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { InputFields } from "@/components/body/input-fields";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { countdown } = useCooldown();
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      subject: "",
    } as ContactInput,

    validators: {
      onSubmit: contactSchema,
    },

    onSubmit: ({ value }) => {
      startTransition(async () => {
        const create = await createMessage({
          ...value,
        });

        if (create.error) {
          console.error(create.error);
          return;
        }

        setSent(true);
      })

      form.reset();

      setCooldown();
    }
  })

  const inputStyle = "bg-sidebar-accent/40 border-(--gold)/30 text-(--text) focus-visible:ring-(--gold)/30 focus-visible:ring-2 focus-visible:border-(--gold)/50"
  const inputCls = "w-full rounded-2xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold";
  const labelCls = "block text-xs tracking-wide mb-1.5";

  if (sent) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border p-12 text-center bg-(--surface) border-border"
      >
        <div>
          <p className="text-3xl">✓</p>
          <p className="mt-3 font-display text-xl text-(--gold) tracking-wide">
            Message Sent!
          </p>
          <p className="mt-2 text-sm text-(--text)">
            We&apos;ll get back to you within 1–2 business days.
          </p>
          <Button
            onClick={() => setSent(false)}
            className="mt-5 text-xs text-(--text-dim) underline"
          >
            Okay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="form-field"></div> */}
      <form
        onSubmit={ev => {
          ev.preventDefault();
          form.handleSubmit(ev);
        }}
        className="contact-form"
      >
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="name">
              {field => (
                <InputFields
                  field={field}
                  label="Name"
                  type="text"
                  autocomplete="name"
                  labelStyling={`${labelCls} text-(--gold)`}
                  inputStyling={`${inputCls} ${inputStyle} h-11`}
                  placeholder="Jane Doe"
                />
              )}
            </form.Field>

            <form.Field name="email">
              {field => (
                <InputFields
                  field={field}
                  label="Email Address"
                  type="email"
                  autocomplete="email"
                  labelStyling={`${labelCls} text-(--gold)`}
                  inputStyling={`${inputCls} ${inputStyle} h-11`}
                  placeholder="jane@example.com"
                />
              )}
            </form.Field>
          </div>

          <form.Field name="subject">
            {field => (
              <InputFields
                field={field}
                label="Subject"
                type="text"
                labelStyling={`${labelCls} text-(--gold)`}
                inputStyling={`${inputCls} ${inputStyle} h-11`}
                placeholder="What's on your mind?"
              />
            )}
          </form.Field>

          <form.Field name="message">
            {field => {
              const isInvalid =
                field.state.meta.isTouched &&
                !field.state.meta.isValid;

              return (
                <>
                  <Label htmlFor={field.name} className={`${labelCls} -mb-2 text-(--gold)`}
                  >
                    Message
                  </Label>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={ev => {
                      field.handleChange(ev.target.value);
                    }}
                    rows={7}
                    aria-invalid={
                      field.state.meta.isTouched &&
                      !field.state.meta.isValid
                    }
                    className={`${inputCls} ${inputStyle} resize-y`}
                    placeholder="Write your message here..."
                  />

                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </>
              )
            }}
          </form.Field>

          <Button
            type="submit"
            disabled={isPending || countdown > 0}
            className="
                  inline-flex 
                  self-start 
                  items-center 
                  gap-2 
                  rounded-2xl
                  px-3 
                  py-1 
                  text-xs 
                  font-medium 
                  transition-colors 
                  hover:opacity-90 
                  disabled:opacity-50 
                  -mt-2
                  bg-(--gold)
                  text-black
                "
            suppressHydrationWarning
          >
            {isPending ? (
              <>
                <Spinner fontSize={16} data-icon="inline-start" />
                Sending...
              </>
            ) : (
              countdown > 0 ?
                `Wait ${countdown}s` :
                <span className="flex gap-2 items-center">
                  <Send size={16} />
                  Send Message
                </span>
            )}
          </Button>
        </FieldGroup>
      </form>
    </>

  );
}
