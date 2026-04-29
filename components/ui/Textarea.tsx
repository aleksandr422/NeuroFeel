"use client";

import { TextareaHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--fs-sm)] text-[var(--color-text)] outline-none transition duration-[var(--duration-base)] ease-[var(--ease-standard)] placeholder:text-[var(--color-text-subtle)] focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--color-primary-500)_40%,transparent)] focus-visible:ring-offset-1",
        className,
      )}
    />
  );
}
