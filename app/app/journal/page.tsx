"use client";

import { useMemo, useState } from "react";
import { EntryList } from "@/components/EntryList";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { deleteEntry, getEntries } from "@/lib/storage";
import { DiaryEntry } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export default function JournalPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getEntries());
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("");
  const [tag, setTag] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const byText = !query || entry.text.toLowerCase().includes(query.toLowerCase());
        const byMood = !mood || entry.manualMood === mood;
        const byTag = !tag || entry.tags.some((item) => item.toLowerCase().includes(tag.toLowerCase()));
        const day = entry.date.slice(0, 10);
        const byFrom = !fromDate || day >= fromDate;
        const byTo = !toDate || day <= toDate;
        return byText && byMood && byTag && byFrom && byTo;
      }),
    [entries, query, mood, tag, fromDate, toDate],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <Card>
        <h1 className="text-2xl font-semibold">{t.diaryNav}</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input placeholder={t.searchJournal} value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">{t.mood}</option>
            <option value="happy">{t.moods.happy}</option>
            <option value="neutral">{t.moods.neutral}</option>
            <option value="sad">{t.moods.sad}</option>
            <option value="angry">{t.moods.angry}</option>
            <option value="anxious">{t.moods.anxious}</option>
            <option value="tired">{t.moods.tired}</option>
          </Select>
          <Input placeholder={t.recurringTopics} value={tag} onChange={(e) => setTag(e.target.value)} />
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Button variant="secondary" onClick={() => { setQuery(""); setMood(""); setTag(""); setFromDate(""); setToDate(""); }}>{t.resetFilters}</Button>
        </div>
      </Card>
      {entries.length === 0 ? (
        <Card tone="muted"><p>{t.emptyJournal}</p></Card>
      ) : filtered.length === 0 ? (
        <Card tone="muted">
          <p>{t.emptyFilterResults}</p>
          <div className="mt-3"><Button variant="secondary" onClick={() => { setQuery(""); setMood(""); setTag(""); setFromDate(""); setToDate(""); }}>{t.resetFilters}</Button></div>
        </Card>
      ) : (
        <EntryList
          entries={filtered}
          onDelete={(entryId) => {
            deleteEntry(entryId);
            setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
          }}
        />
      )}
    </div>
  );
}
