"use client";

import { useState } from "react";
import { DiaryInput } from "@/components/DiaryInput";
import { EntryList } from "@/components/EntryList";
import { NavBar } from "@/components/NavBar";
import { deleteEntry, getEntries } from "@/lib/storage";
import { DiaryEntry } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getEntries());
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-2">
        <DiaryInput
          key={editingEntry?.id ?? "new-entry"}
          editingEntry={editingEntry}
          onEntryAdded={(entry) => setEntries((prev) => [entry, ...prev])}
          onEntryUpdated={(updatedEntry) => {
            setEntries((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
            setEditingEntry(null);
          }}
        />
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">{t.recentEntries}</h2>
          <EntryList
            entries={entries}
            onEdit={(entry) => setEditingEntry(entry)}
            onDelete={(entryId) => {
              deleteEntry(entryId);
              setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
              setEditingEntry((prev) => (prev?.id === entryId ? null : prev));
            }}
          />
        </div>
      </main>
    </div>
  );
}
