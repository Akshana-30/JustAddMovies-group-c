import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminDashboardRoot() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?callbackUrl=/admin-dashboard");
  }

  const isAdmin = session?.user.role === "ADMIN";
  redirect(isAdmin ? "/admin-dashboard/admin" : "/admin-dashboard/dashboard");
}
