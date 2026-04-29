"use client";

import { useEffect, useRef, useState } from "react";
import { Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/useLanguage";
import { Button } from "@/components/ui/Button";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const options: Array<{ code: Language; label: string }> = [
    { code: "en", label: `EN ${t.languageEnglish}` },
    { code: "ru", label: `RU ${t.languageRussian}` },
  ];

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
      <Button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        variant="secondary"
        size="sm"
      >
        {language.toUpperCase()}
      </Button>

      <div
        className={`absolute right-0 mt-2 min-w-40 origin-top-right rounded-2xl border border-violet-200 bg-white p-1.5 text-sm text-slate-700 shadow-xl shadow-violet-100 transition-all duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {options.map((option) => {
          const isActive = option.code === language;
          return (
            <Button
              key={option.code}
              type="button"
              onClick={() => {
                setLanguage(option.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-start rounded-xl px-3 py-2 text-left transition ${
                isActive ? "bg-violet-100 text-violet-700" : "hover:bg-violet-50"
              }`}
              variant="ghost"
              size="sm"
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
