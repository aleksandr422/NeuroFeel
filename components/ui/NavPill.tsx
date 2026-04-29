"use client";

import Link from "next/link";
import { cn } from "@/components/ui/cn";

export function NavPill({ href, active, children, className }: { href: string; active?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 min-w-[132px] items-center justify-center rounded-[var(--radius-pill)] px-6 py-2.5 text-[var(--fs-sm)] font-[var(--fw-semibold)] tracking-[0.01em] transition duration-[var(--duration-base)] ease-[var(--ease-standard)]",
        active
          ? "bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-card-hover)]"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary-600)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
