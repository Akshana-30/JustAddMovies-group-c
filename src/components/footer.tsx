import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary-foreground/5 text-muted-foreground mb-0">
      <p className="px-6 py-5 text-center text-xs">
        All rights reserved © Just Add Movies {year}
        <span className="mx-2 opacity-40">·</span>
        <Link href="/about" className="transition-colors hover:text-primary">About Us</Link>
        <span className="mx-2 opacity-40">·</span>
        <Link href="/contact" className="transition-colors hover:text-primary">Contact</Link>
        <span className="mx-2 opacity-40">·</span>
        <Link href="/about#cookies" className="transition-colors hover:text-primary">Cookie Policy</Link>
        <span className="mx-2 opacity-40">·</span>
        Powered by Next.js &amp; Prisma
      </p>
    </footer>
  );
}
