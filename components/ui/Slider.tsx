"use client";

import { KeyboardEvent, useMemo } from "react";

/**
 * Accessible slider without native range styling.
 */
export function Slider({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const percent = useMemo(() => ((value - min) / Math.max(1, max - min)) * 100, [value, min, max]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    onChange(Math.min(max, Math.max(min, value + (event.key === "ArrowRight" ? 1 : -1))));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const next = Math.round((x / rect.width) * (max - min) + min);
        onChange(Math.max(min, Math.min(max, next)));
      }}
      className="relative h-5 cursor-pointer"
    >
      <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-[var(--color-primary-100)]" />
      <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--color-primary-500)]" style={{ width: `${percent}%` }} />
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-[var(--color-border)]"
        style={{ left: `calc(${percent}% - 10px)` }}
      />
    </div>
  );
}
