"use client";

import { AIAnalysis } from "@/lib/types";
import { getLocalizedAnalysis } from "@/lib/localize";
import { useLanguage } from "@/lib/useLanguage";

export function AdviceCard({ analysis }: { analysis: AIAnalysis | null }) {
  const { t, language } = useLanguage();
  if (!analysis) return null;
  const localized = getLocalizedAnalysis(analysis, language);
  const message = analysis.message ?? analysis.advice;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">{t.aiSupport}</h3>
      <p className="mt-2 text-sm text-slate-700">
        <span className="font-medium">{t.mood}:</span> {localized.moodLabel}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        <span className="font-medium">{t.emotions}:</span> {localized.emotionLabels.join(", ")}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        <span className="font-medium">{t.problemEvent}:</span> {localized.problemLabel}
      </p>
      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-line">{message}</p>
      <p className="mt-3 text-xs text-slate-500">{t.disclaimer}</p>
    </section>
  );
}
