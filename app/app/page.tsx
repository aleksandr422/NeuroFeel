"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { dismissExportReminderFor30Days, getEntries, markExportedNow, shouldShowExportReminder } from "@/lib/storage";
import { useLanguage } from "@/lib/useLanguage";
import { aggregateMoodTrend } from "@/lib/chart";
import { generateWeeklySummary } from "@/lib/summary";
import Link from "next/link";
import { ScopeNotice } from "@/components/safety/ScopeNotice";

export default function AppDashboardPage() {
  const { t, language } = useLanguage();
  const entries = getEntries();
  const todayKey = new Date().toISOString().slice(0, 10);
  const hasTodayEntry = entries.some((entry) => entry.date.slice(0, 10) === todayKey);
  const trend = useMemo(() => aggregateMoodTrend(entries.slice(0, 30), language).slice(0, 7), [entries, language]);
  const summary = generateWeeklySummary(entries, language);
  const remaining = Math.max(0, 3 - entries.length);
  const showExportReminder = shouldShowExportReminder();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      {showExportReminder ? (
        <Card tone="muted">
          <p className="text-sm">{t.exportReminder}</p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${t.exportFileName}.json`;
                a.click();
                URL.revokeObjectURL(url);
                markExportedNow();
              }}
            >
              {t.exportNow}
            </Button>
            <Button variant="ghost" onClick={() => dismissExportReminderFor30Days()}>{t.hideInSession}</Button>
          </div>
        </Card>
      ) : null}
      <Card>
        <h1 className="text-2xl font-semibold">{t.todayNav}</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{hasTodayEntry ? t.todayDone : t.todayMissing}</p>
      </Card>
      {entries.length === 0 ? (
        <Card tone="muted">
          <p className="text-sm">{t.emptyDashboardNoEntries}</p>
          <p className="mt-3"><Button onClick={() => window.dispatchEvent(new CustomEvent("minddiary:open-writer"))}>{t.writeToday}</Button></p>
        </Card>
      ) : (
        <Card>
          <h2 className="text-lg font-semibold">{t.moodTrend}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-7">
            {trend.map((point) => <div key={point.key} className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2 text-xs">{point.label}: {point.score}/5</div>)}
          </div>
        </Card>
      )}
      {entries.length < 3 ? (
        <Card tone="muted">
          <p>{t.emptyDashboardNeedMore.replace("{count}", String(remaining))}</p>
          <div className="mt-3 h-2 rounded-full bg-[var(--color-primary-100)]"><div className="h-2 rounded-full bg-[var(--color-primary-500)]" style={{ width: `${Math.round((entries.length / 3) * 100)}%` }} /></div>
        </Card>
      ) : (
        <Card>
          <h2 className="text-lg font-semibold">{t.weeklySummaryEyebrow}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{summary.observations.join(" ")}</p>
          <p className="mt-2 text-sm">{summary.suggestion ?? t.summaryNeedMoreData}</p>
          <ScopeNotice text={t.summaryScopeLine} className="mt-3" />
        </Card>
      )}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">{t.diaryNav}</p>
          <Link href="/app/journal"><Button variant="secondary">{t.openAction}</Button></Link>
        </div>
      </Card>
    </div>
  );
}
