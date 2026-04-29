"use client";

import { HomeTranslation } from "@/components/home/types";
import { WeeklySummary } from "@/lib/summary";
import { InfoTooltip } from "@/components/InfoTooltip";

export function AnalyticsPreview({ t, summary }: { t: HomeTranslation; summary: WeeklySummary }) {
  return (
    <section id="reviews" className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/70">
        <p className="text-sm font-semibold text-violet-700">{t.analyticsEyebrow}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{t.analyticsTitle}</h3>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-violet-50 via-indigo-50 to-white p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
            {[t.weekdayMon, t.weekdayTue, t.weekdayWed, t.weekdayThu, t.weekdayFri, t.weekdaySat, t.weekdaySun].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-4 flex h-28 items-end gap-2">
            {[36, 60, 72, 55, 82, 74, 79].map((height, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-xl bg-gradient-to-t from-[#6D5EF5] to-[#A78BFA]"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/70">
        <p className="text-sm font-semibold text-violet-700">
          {t.analyticsReflectionEyebrow}
          <InfoTooltip text={t.autoSummaryDisclaimer} />
        </p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{t.analyticsReflectionTitle}</h3>
        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-slate-700">
          {summary.observations[0] ?? t.analyticsReflectionText}
        </p>
        <div className="mt-4 rounded-2xl bg-violet-50 p-4">
          <p className="text-sm font-medium text-violet-800">{t.analyticsActionTitle}</p>
          <p className="mt-1 text-sm text-violet-700">{summary.suggestion ?? t.summaryNeedMoreData}</p>
        </div>
      </article>
    </section>
  );
}
