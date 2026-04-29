"use client";

export function ScopeNotice({ text, className = "" }: { text: string; className?: string }) {
  return <p className={`text-xs text-[var(--color-text-subtle)] ${className}`}>{text}</p>;
}
