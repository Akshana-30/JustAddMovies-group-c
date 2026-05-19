"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface AddressData {
  street:  string;
  city:    string;
  state?:  string | null;
  zipCode: string;
  country: string;
}

// Save (create or update) the user's default address.
// The first address in the relation is treated as default.
export async function saveDefaultAddress(data: AddressData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "Unauthorized" };

  const userId = session.user.id;

  // Find existing addresses for this user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { address: { take: 1 } },
  });

  if (!user) return { success: false, error: "User not found" };

  if (user.address.length > 0) {
    // Update the existing default address in-place
    await prisma.address.update({
      where: { id: user.address[0].id },
      data: {
        street:  data.street,
        city:    data.city,
        state:   data.state ?? null,
        zipCode: data.zipCode,
        country: data.country,
      },
    });
  } else {
    // Create a new address and connect it to the user
    await prisma.address.create({
      data: {
        id:      crypto.randomUUID(),
        street:  data.street,
        city:    data.city,
        state:   data.state ?? null,
        zipCode: data.zipCode,
        country: data.country,
        users:   { connect: { id: userId } },
      },
    });
  }

  revalidatePath("/admin-dashboard/dashboard/account");
  return { success: true };
}

// Fetch the user's default address (first in the relation).
export async function getDefaultAddress(): Promise<(AddressData & { id: string }) | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { address: { take: 1 } },
  });

  return user?.address[0] ?? null;
}
