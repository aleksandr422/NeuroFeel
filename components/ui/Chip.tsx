"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

export function Chip({ className, tone = "neutral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "primary" | "muted" }) {
  const toneClass =
    tone === "primary"
      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]"
      : tone === "muted"
        ? "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
        : "bg-[var(--color-surface)] text-[var(--color-text)] ring-1 ring-[var(--color-border)]";
  return <span {...props} className={cn("inline-flex rounded-[var(--radius-pill)] px-3 py-1 text-[var(--fs-xs)]", toneClass, className)} />;
}
