"use client";

import Link from "next/link";
import { HomeTranslation } from "@/components/home/types";
import { Mood } from "@/lib/mood";
import { MoodScore } from "@/components/MoodScore";

interface HeroSectionProps {
  t: HomeTranslation;
  entryCount: number;
  averageMood: Mood | null;
}

export function HeroSection({ t, entryCount, averageMood }: HeroSectionProps) {
  const safeMood: Mood = averageMood ?? 3;
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-white px-6 py-12 shadow-xl shadow-violet-100/70 sm:px-10 lg:px-12">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700">
            {t.heroBadge}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            {t.heroTitleStart}{" "}
            <span className="bg-gradient-to-r from-[#6D5EF5] via-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
            {t.heroSubtitle}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/diary"
              className="rounded-2xl bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {t.newEntry}
            </Link>
            <Link
              href="/statistics"
              className="rounded-2xl border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              {t.viewStats}
            </Link>
          </div>
          <p className="mt-3 text-sm text-slate-500">{t.heroHelperText}</p>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-6 shadow-xl">
          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-violet-700">{t.heroPreviewTitle}</p>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                {entryCount === 0 ? t.heroDemoBadge : t.heroPreviewLive}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="col-span-2 rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{t.heroPreviewMoodScore}</p>
                <MoodScore mood={safeMood} />
              </div>
              <div className="rounded-2xl bg-violet-50 p-3">
                <p className="text-xs text-violet-700">{t.heroPreviewDailyFocus}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{t.heroPreviewDailyFocusValue}</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{t.heroPreviewInsightTitle}</p>
              <p className="mt-1 text-sm text-slate-700">{t.heroPreviewInsightText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
