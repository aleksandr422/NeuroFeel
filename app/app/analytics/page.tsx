"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { getEntries } from "@/lib/storage";
import { useLanguage } from "@/lib/useLanguage";
import { aggregateMoodTrend } from "@/lib/chart";
import { averageMood } from "@/lib/mood";
import { generateWeeklySummary } from "@/lib/summary";
import { ScopeNotice } from "@/components/safety/ScopeNotice";

export default function AnalyticsPage() {
  const { t, language } = useLanguage();
  const entries = getEntries();
  const avgMood = averageMood(entries);
  const trend = useMemo(() => aggregateMoodTrend(entries, language), [entries, language]);
  const summary = generateWeeklySummary(entries, language);

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <Card>
        <h1 className="text-2xl font-semibold">{t.analyticsNav}</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.analyticsMergedDescription}</p>
        <div className="mt-3 flex gap-2">
          <a href="#numbers" className="rounded-[var(--radius-pill)] bg-[var(--color-primary-100)] px-3 py-1 text-xs text-[var(--color-primary-600)]">{t.analyticsNumbers}</a>
          <a href="#observations" className="rounded-[var(--radius-pill)] bg-[var(--color-primary-100)] px-3 py-1 text-xs text-[var(--color-primary-600)]">{t.analyticsObservations}</a>
        </div>
      </Card>
      <Card id="numbers">
        <h2 className="text-lg font-semibold">{t.analyticsNumbers}</h2>
        {entries.length < 7 ? (
          <div className="mt-3 space-y-2">
            <p>{t.emptyAnalyticsWeek}</p>
            {entries.slice(0, 7).map((entry) => <p key={entry.id} className="text-sm text-[var(--color-text-muted)]">• {new Date(entry.date).toLocaleDateString()} — {entry.text.slice(0, 60)}</p>)}
          </div>
        ) : (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3">{t.statsAverageMood}: {avgMood ?? "-"}</div>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3">{t.moodTrend}: {trend.length}</div>
          </div>
        )}
      </Card>
      <Card id="observations">
        <h2 className="text-lg font-semibold">{t.analyticsObservations}</h2>
        {entries.length < 3 ? <p className="mt-2">{t.emptyObservations}</p> : <p className="mt-2 text-sm text-[var(--color-text-muted)]">{summary.observations.join(" ")} {summary.suggestion ?? ""}</p>}
        <ScopeNotice text={t.summaryScopeLine} className="mt-3" />
      </Card>
    </div>
  );
}
