"use client";

import { useEffect, useRef, useState } from "react";
import { DiaryEntry } from "@/lib/types";
import { getLocalizedEntry } from "@/lib/localize";
import { useLanguage } from "@/lib/useLanguage";
import { Tag } from "@/components/ui/Tag";

export function EntryList({
  entries,
  onEdit,
  onDelete,
}: {
  entries: DiaryEntry[];
  onEdit?: (entry: DiaryEntry) => void;
  onDelete: (entryId: string) => void;
}) {
  const { t, language } = useLanguage();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, []);

  if (!entries.length) {
    return <p className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">{t.noEntriesYet}</p>;
  }

  return (
    <section ref={containerRef} className="space-y-3">
      {entries.map((entry) => {
        const localized = getLocalizedEntry(entry, language);
        return (
          <article key={entry.id} className="relative rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => setOpenMenuId((prev) => (prev === entry.id ? null : entry.id))}
            className="absolute right-3 top-3 rounded-full px-2 py-1 text-slate-500 transition hover:bg-[#f1e5d6] hover:text-slate-700"
            aria-label={`${t.edit}/${t.delete}`}
          >
            ⋯
          </button>
          <div
            className={`absolute right-3 top-11 z-10 w-36 origin-top-right rounded-xl border border-[#e6d8c2] bg-[#f9f3ea] p-1.5 shadow-lg shadow-slate-200/80 transition-all duration-150 ${
              openMenuId === entry.id ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            {onEdit ? (
              <button
                type="button"
                onClick={() => {
                  onEdit(entry);
                  setOpenMenuId(null);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-[#efe1ca]"
              >
                {t.edit}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setDeleteTargetId(entry.id);
                setOpenMenuId(null);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-700 transition hover:bg-rose-100"
            >
              {t.delete}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            {new Date(entry.date).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}
            {entry.isEdited && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">{t.edited}</span>}
          </p>
          <p className="mt-2 text-sm text-slate-700">{entry.text}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Tag tone="primary-soft">{t.moodPrefix}: {localized.moodLabel}</Tag>
            {localized.tagLabels
              .map((tag, index) => ({ tag, index }))
              .filter((item) => (entry.tagConfidences?.[item.index] ?? 1) >= 0.6)
              .map((item) => (
                <Tag
                  key={`${entry.id}-${entry.tags[item.index] ?? item.tag}-${item.index}`}
                  tone="primary-soft"
                >
                  {item.tag || entry.tags[item.index]}
                </Tag>
              ))}
          </div>
          </article>
        );
      })}
      {deleteTargetId && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-sm text-slate-800">{t.confirmDeleteTitle}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={!deleteTargetId}
                onClick={() => {
                  if (!deleteTargetId) return;
                  onDelete(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
