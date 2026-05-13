// src/components/sidebar/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

type AppSidebarProps = {
  items: NavItem[];
  title: string;
  subtitle?: string;
};

export function AppSidebar({ items, title, subtitle }: AppSidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{
        background: "var(--color-surface, hsl(var(--card)))",
        borderRight: "1px solid hsl(var(--border))",
        minHeight: "100%",
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={11}
          height={11}
          fill="currentColor"
          viewBox="0 0 24 24"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold tracking-widest text-primary">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 p-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href.length > 1 && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-primary/10 text-primary border border-primary/25"
                  : "text-muted-foreground border border-transparent hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>

              {!collapsed && (
                <span className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="ml-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold"
                      style={{ background: "var(--gold)", color: "#1a1a1a" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
