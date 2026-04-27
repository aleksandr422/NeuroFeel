"use client";

import { useEffect, useRef, useState } from "react";
import { Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/useLanguage";

const options: Array<{ code: Language; label: string }> = [
  { code: "en", label: "EN English" },
  { code: "ru", label: "RU Русский" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative ml-auto">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-[#d9ccb5] bg-[#f6ede0] px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[#f1e5d6]"
      >
        {language.toUpperCase()}
      </button>

      <div
        className={`absolute right-0 mt-2 min-w-40 origin-top-right rounded-xl border border-slate-700/50 bg-slate-900/95 p-1.5 text-sm text-slate-100 shadow-lg shadow-slate-900/30 transition-all duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {options.map((option) => {
          const isActive = option.code === language;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                setLanguage(option.code);
                setOpen(false);
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition ${
                isActive ? "bg-blue-500/25 text-blue-100" : "text-slate-100 hover:bg-slate-700/70"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
