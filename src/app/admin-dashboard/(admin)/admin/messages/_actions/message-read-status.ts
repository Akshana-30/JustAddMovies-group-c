"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function MessageReadStatus(id: string, isRead: boolean) {
    await prisma.contactMessage.update({
        where: { id },
        data: { read: isRead},
    });

    revalidatePath("/messages")
}