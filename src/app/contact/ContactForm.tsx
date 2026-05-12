// src/app/contact/ContactForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

const contactSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  email:   z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  function onSubmit(data: ContactInput) {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      reset();
    });
  }

  const inputStyle = {
    background: "var(--surface)",
    borderColor: "var(--border)",
    color: "var(--text)",
  };
  const inputCls = "w-full rounded border px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold";
  const labelCls = "block text-xs tracking-wide mb-1.5";

  if (sent) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border p-12 text-center"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <p className="text-3xl">✓</p>
          <p className="mt-3 font-display text-xl tracking-wide" style={{ color: "var(--gold)" }}>
            Message Sent!
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            We&apos;ll get back to you within 1–2 business days.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-5 text-xs underline"
            style={{ color: "var(--text-dim)" }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="form-field">
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Your Name</label>
          <input className={inputCls} style={inputStyle} placeholder="Jane Doe" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="form-field">
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Email Address</label>
          <input type="email" className={inputCls} style={inputStyle} placeholder="jane@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div className="form-field">
        <label className={labelCls} style={{ color: "var(--text-muted)" }}>Subject</label>
        <input className={inputCls} style={inputStyle} placeholder="What's on your mind?" {...register("subject")} />
        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
      </div>

      <div className="form-field">
        <label className={labelCls} style={{ color: "var(--text-muted)" }}>Message</label>
        <textarea
          rows={6}
          className={inputCls}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Write your message here…"
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded px-6 py-2.5 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--gold)", color: "#000" }}
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
