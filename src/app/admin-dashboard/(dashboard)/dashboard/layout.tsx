// src/app/admin-dashboard/(dashboard)/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Package, Heart, User } from "lucide-react";

async function getDashboardCounts(userId: string) {
  const orders = await prisma.order.count({ where: { userId } });

  // wishlistItem table may not exist yet if migration hasn't run
  let wishlist = 0;
  try {
    wishlist = await prisma.wishlistItem.count({ where: { userId } });
  } catch {
    wishlist = 0;
  }

  return { orders, wishlist };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in?callbackUrl=/admin-dashboard/dashboard");

  const counts = await getDashboardCounts(session.user.id);

  const navItems = [
    { label: "My Orders", href: "/admin-dashboard/dashboard",          icon: <Package size={16}/>, badge: counts.orders },
    { label: "Wishlist",  href: "/admin-dashboard/dashboard/wishlist", icon: <Heart   size={16}/>, badge: counts.wishlist },
    { label: "Account",   href: "/admin-dashboard/dashboard/account",  icon: <User    size={16}/> },
  ];

  return (
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar title="MY ACCOUNT" subtitle={session.user.email} items={navItems} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
  );
}