"use client";

import { PatternInsight, RecurringProblemSupport } from "@/lib/types";
import { localizeProblem } from "@/lib/localize";
import { useLanguage } from "@/lib/useLanguage";

export function PatternInsights({
  insights,
  recurring,
}: {
  insights: PatternInsight[];
  recurring: RecurringProblemSupport[];
}) {
  const { t, language } = useLanguage();

  return (
    <section className="space-y-4">
      {insights.map((insight) => (
        <div key={insight.key} className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          {insight.message}
        </div>
      ))}

      {recurring.map((item) => (
        <div key={item.problem} className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <h3 className="font-semibold text-purple-900">{t.recurringProblem}: {localizeProblem(item.problem, language)}</h3>
          <p className="mt-2 text-sm text-purple-900">{item.explanation}</p>
          <p className="mt-1 text-sm text-purple-900">
            <span className="font-medium">{t.possibleCause}:</span> {item.possibleCause}
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-purple-900">
            {item.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
