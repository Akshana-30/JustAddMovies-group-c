import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminDashboardRoot() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/admin-dashboard");
  }

  const isAdmin = (session.user as any)?.role === "ADMIN";
  redirect(isAdmin ? "/admin-dashboard/admin" : "/admin-dashboard/dashboard");
}
