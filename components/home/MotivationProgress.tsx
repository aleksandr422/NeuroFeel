"use client";

import Link from "next/link";
import { HomeTranslation } from "@/components/home/types";

export function MotivationProgress({ t, entryCount, streakDays }: { t: HomeTranslation; entryCount: number; streakDays: number }) {
  const target = 3;
  const progress = Math.min(100, Math.round((entryCount / target) * 100));
  const remaining = Math.max(0, target - entryCount);

  const title =
    entryCount === 0
      ? t.motivationStartTitle
      : remaining > 0
        ? t.motivationProgressTitle.replace("{count}", String(remaining))
        : t.motivationUnlockedTitle;

  const subtitle =
    entryCount === 0
      ? t.motivationStartText
      : remaining > 0
        ? t.motivationProgressText.replace("{count}", String(remaining))
        : t.motivationUnlockedText;

  return (
    <section className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{t.motivationEyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-violet-50 px-4 py-2 text-sm text-violet-700">
          {t.statsStreak}: <span className="font-bold">{streakDays}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>{t.motivationProgressLabel}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-violet-100">
          <div className="h-2 rounded-full bg-gradient-to-r from-[#6D5EF5] to-[#A78BFA]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/diary" className="rounded-2xl bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white">
          {t.newEntry}
        </Link>
        <Link href="/insights" className="rounded-2xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700">
          {t.quickActionInsights}
        </Link>
      </div>
    </section>
  );
}
