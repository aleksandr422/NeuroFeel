"use client";

import Link from "next/link";
import { HomeTranslation } from "@/components/home/types";
import { Mood } from "@/lib/mood";
import { MoodScore } from "@/components/MoodScore";

export function DemoAnalytics({ t, entryCount, averageMood }: { t: HomeTranslation; entryCount: number; averageMood: Mood | null }) {
  if (entryCount >= 3) return null;
  const safeMood: Mood = averageMood ?? 3;

  return (
    <section className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/60">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{t.demoEyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{t.demoTitle}</h2>
      <p className="mt-2 text-sm text-slate-600">{t.demoSubtitle}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-violet-50 p-4">
          <p className="text-xs text-violet-700">{t.heroPreviewMoodScore}</p>
          <MoodScore mood={safeMood} />
        </div>
        <div className="rounded-2xl bg-violet-50 p-4">
          <p className="text-xs text-violet-700">{t.analyticsReflectionEyebrow}</p>
          <p className="mt-1 text-sm text-slate-800">{t.analyticsReflectionText}</p>
        </div>
        <div className="rounded-2xl bg-violet-50 p-4">
          <p className="text-xs text-violet-700">{t.motivationProgressLabel}</p>
          <p className="mt-1 text-sm text-slate-800">
            {entryCount === 0 ? t.demoCtaHint : t.demoPartialHint.replace("{count}", String(3 - entryCount))}
          </p>
        </div>
      </div>
      <Link href="/diary" className="mt-4 inline-flex rounded-2xl bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white">
        {entryCount === 0 ? t.statsCreateFirstEntry : t.newEntry}
      </Link>
    </section>
  );
}
