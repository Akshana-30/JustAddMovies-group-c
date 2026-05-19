"use server";

import z from "zod";
import { contactSchema } from "../_schemas/contact";
import prisma from "@/lib/prisma";

type CreateMessageValues = z.infer<typeof contactSchema>;

export async function createMessage(values: CreateMessageValues) {
    const data = contactSchema.parse(values);

    try {
        await prisma.contactMessage.create({
            data: {
                email: data.email,
                message: data.message,
                name: data.name,
                subject: data.subject,
            },
        });

        return { ok: true }
    } catch {
        return { ok: false, error: "Unknown error occurred" }
    }
}