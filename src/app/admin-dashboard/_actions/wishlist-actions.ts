// src/app/admin-dashboard/_actions/wishlist-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

// ── Wishlist ─────────────────────────────────────────
export async function addToWishlist(movieId: string) {
  const session = await requireSession();
  if (!session) return actionError("Sign in to add to wishlist");
  try {
    await prisma.wishlistItem.create({ data: { userId: session.user.id, movieId } });
    revalidatePath("/admin-dashboard/dashboard/wishlist");
    return actionSuccess({ ok: true });
  } catch {
    return actionError("Already in wishlist");
  }
}

export async function removeFromWishlist(movieId: string) {
  const session = await requireSession();
  if (!session) return actionError("Unauthorized");
  await prisma.wishlistItem.deleteMany({ where: { userId: session.user.id, movieId } });
  revalidatePath("/admin-dashboard/dashboard/wishlist");
  return actionSuccess({ ok: true });
}

export async function getWishlist() {
  const session = await requireSession();
  if (!session) return [];
  return prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { movie: { select: { id: true, title: true, price: true, imageUrl: true, stock: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function isInWishlist(movieId: string): Promise<boolean> {
  const session = await requireSession();
  if (!session) return false;
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId } },
  });
  return !!item;
}

// ── Stock Alerts ─────────────────────────────────────
export async function registerStockAlert(movieId: string) {
  const session = await requireSession();
  if (!session) return actionError("Sign in to register interest");
  try {
    await prisma.stockAlert.create({ data: { userId: session.user.id, movieId } });
    revalidatePath(`/movies/${movieId}`);
    return actionSuccess({ ok: true });
  } catch {
    return actionSuccess({ ok: true }); // already registered, that's fine
  }
}

export async function cancelStockAlert(movieId: string) {
  const session = await requireSession();
  if (!session) return actionError("Unauthorized");
  await prisma.stockAlert.deleteMany({ where: { userId: session.user.id, movieId } });
  revalidatePath(`/movies/${movieId}`);
  return actionSuccess({ ok: true });
}

export async function hasStockAlert(movieId: string): Promise<boolean> {
  const session = await requireSession();
  if (!session) return false;
  const item = await prisma.stockAlert.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId } },
  });
  return !!item;
}
