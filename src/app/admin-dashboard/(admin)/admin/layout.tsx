// src/app/admin-dashboard/(admin)/admin/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { LayoutDashboard, Film, Tag, Users, ShoppingCart, UserCheck, Download } from "lucide-react";

async function getAdminCounts() {
  const [movies, genres, directors, actors, pendingOrders, customers] = await Promise.all([
    prisma.movie.count(),
    prisma.genre.count(),
    prisma.director.count(),
    prisma.actor.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
  ]);
  return { movies, genres, people: directors + actors, pendingOrders, customers };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in?callbackUrl=/admin-dashboard/admin");

  const role = session?.user.role;
  if (role !== "ADMIN") redirect("/");

  const counts = await getAdminCounts();

  const navItems = [
    { label: "Overview",  href: "/admin-dashboard/admin",           icon: <LayoutDashboard size={16}/> },
    { label: "Movies",    href: "/admin-dashboard/admin/movies",    icon: <Film size={16}/>,           badge: counts.movies },
    { label: "Import",    href: "/admin-dashboard/admin/import",    icon: <Download size={16}/> },
    { label: "Genres",    href: "/admin-dashboard/admin/genres",    icon: <Tag size={16}/>,            badge: counts.genres },
    { label: "People",    href: "/admin-dashboard/admin/people",    icon: <Users size={16}/>,          badge: counts.people },
    { label: "Customers", href: "/admin-dashboard/admin/customers", icon: <UserCheck size={16}/>,      badge: counts.customers },
    { label: "Orders",    href: "/admin-dashboard/admin/orders",    icon: <ShoppingCart size={16}/>,   badge: counts.pendingOrders },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      <AppSidebar title="ADMIN" subtitle={session.user.name ?? session.user.email} items={navItems} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
