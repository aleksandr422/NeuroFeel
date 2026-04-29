"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

export function Tag({ className, tone = "primary-soft", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "primary-soft" | "muted" }) {
  const toneClass =
    tone === "primary-soft"
      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]"
      : tone === "muted"
        ? "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
        : "bg-[var(--color-surface)] text-[var(--color-text)] ring-1 ring-[var(--color-border)]";
  return <span {...props} className={cn("inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-1 text-[var(--fs-xs)] font-[var(--fw-medium)]", toneClass, className)} />;
}
