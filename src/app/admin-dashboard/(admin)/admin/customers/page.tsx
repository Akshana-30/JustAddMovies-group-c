import type { Metadata } from "next";
import { users } from "./_actions/users";
import { UserSection } from "./_components/user-section";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const customers = users.filter((u) => u.role !== "ADMIN");
  const admins = users.filter((u) => u.role === "ADMIN");

  return (
    <div className="p-8">
      <h1 className="font-display mb-1 text-3xl tracking-wide" style={{ color: "var(--text)" }}>
        <span style={{ color: "var(--gold)" }}>Customers</span>
      </h1>
      <p className="mb-8  font-serif italic" style={{ color: "var(--text-muted)" }}>
        {customers.length} customers · {admins.length} admin{admins.length !== 1 ? "s" : ""}
      </p>

      <UserSection title="Customers" people={customers} count={customers.length} />
      <UserSection title="Admins" people={admins} count={admins.length} />
    </div>
  );
}
