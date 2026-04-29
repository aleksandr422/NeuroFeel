"use client";

import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Info"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-violet-200 bg-white text-xs font-semibold text-violet-700"
      >
        i
      </button>
      {open ? (
        <span className="absolute left-1/2 top-7 z-20 w-56 -translate-x-1/2 rounded-xl border border-violet-200 bg-white p-2 text-xs text-slate-700 shadow-lg shadow-violet-100">
          {text}
        </span>
      ) : null}
    </span>
  );
}
