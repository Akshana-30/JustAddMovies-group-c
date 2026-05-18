import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { AdminPeopleTable } from "./AdminPeopleTable";

export const metadata: Metadata = { title: "Manage People" };

export default async function AdminPeoplePage() {
  const [directors, actors] = await Promise.all([
    prisma.director.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { movies: true } } } }),
    prisma.actor.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { movies: true } } } }),
  ]);
  return (
    <div className="p-8">
      <h1 className="font-display mb-1 text-3xl tracking-wide" style={{ color: "var(--text)" }}>
        Manage <span style={{ color: "var(--gold)" }}>People</span>
      </h1>
      <p className="mb-6 font-serif italic" style={{ color: "var(--text-muted)" }}>
        {directors.length} directors · {actors.length} actors
      </p>
      <AdminPeopleTable directors={directors} actors={actors} />
    </div>
  );
}
