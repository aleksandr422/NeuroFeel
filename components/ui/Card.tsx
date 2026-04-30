"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type CardTone = "default" | "muted" | "accent";

/**
 * Surface card primitive with consistent radius/border/shadow.
 */
export function Card({
  className,
  tone = "default",
  padding = "md",
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: CardTone; padding?: "sm" | "md" | "lg" }) {
  const toneClass =
    tone === "accent"
      ? "border-transparent text-white [background:var(--color-accent-gradient)]"
      : tone === "muted"
        ? "border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text)] shadow-[var(--shadow-card)]"
        : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-card)]";
  const padClass = padding === "sm" ? "p-4" : padding === "lg" ? "p-8" : "p-5";

  return <div {...props} className={cn("rounded-[var(--radius-lg)]", toneClass, padClass, className)} />;
}
