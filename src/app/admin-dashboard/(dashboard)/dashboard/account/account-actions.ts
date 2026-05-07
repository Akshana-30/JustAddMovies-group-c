// src/app/admin-dashboard/(dashboard)/dashboard/account/account-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string; shippingAddress?: string }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.id !== userId) return actionError("Unauthorized");

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name           && { name: data.name }),
        phone:           data.phone           ?? null,
        shippingAddress: data.shippingAddress ?? null,
      },
    });
    revalidatePath("/admin-dashboard/dashboard/account");
    return actionSuccess({ ok: true });
  } catch (err) {
    console.error(err);
    return actionError("Failed to update profile");
  }
}
