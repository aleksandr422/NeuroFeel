"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Branded pill button primitive used across pages.
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  iconOnly = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
}) {
  const sizeClass =
    size === "sm"
      ? iconOnly
        ? "h-9 w-9 text-[var(--fs-sm)]"
        : "px-4 py-2 text-[var(--fs-sm)]"
      : size === "lg"
        ? iconOnly
          ? "h-12 w-12 text-[var(--fs-base)]"
          : "px-7 py-3 text-[var(--fs-base)]"
        : iconOnly
          ? "h-11 w-11 text-[var(--fs-base)]"
          : "px-5 py-2.5 text-[var(--fs-sm)]";

  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] active:scale-[0.98]"
      : variant === "secondary"
        ? "border border-[var(--color-primary-500)] bg-[var(--color-surface)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-100)]"
        : variant === "danger"
          ? "bg-[var(--color-danger-500)] text-white hover:brightness-95 active:scale-[0.98]"
          : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-primary-100)]";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-[var(--fw-semibold)] transition duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--color-primary-500)_40%,transparent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizeClass,
        variantClass,
        className,
      )}
    />
  );
}
