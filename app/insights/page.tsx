"use client";

import { useMemo, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { detectPatterns, getRecurringProblemSupport } from "@/lib/patterns";
import { getEntries } from "@/lib/storage";
import { DiaryEntry, PatternInsight, RecurringProblemSupport } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

type InsightType = "pattern" | "behavior" | "warning" | "suggestion";
type InsightPriority = "high" | "medium" | "low";

type InsightCard = {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  shortDescription: string;
  explanation: string;
  possibleCauses: string[];
  suggestions: string[];
};

export default function InsightsPage() {
  const [entries] = useState<DiaryEntry[]>(() => getEntries());
  const { t, language } = useLanguage();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const insights = useMemo(() => detectPatterns(entries, language), [entries, language]);
  const recurring = useMemo(() => getRecurringProblemSupport(entries, language), [entries, language]);
  const cards = useMemo(() => buildInsightCards(insights, recurring, language), [insights, recurring, language]);

  return (
    <div className="min-h-screen bg-[#f8f3ea]">
      <NavBar />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">{t.patternInsights}</h1>
        <p className="text-sm text-slate-600">{t.insightsSubtitle}</p>

        {cards.length === 0 ? (
          <section className="rounded-3xl border border-[#eadfcf] bg-white p-8 shadow-sm">
            <p className="text-slate-600">{t.noInsightsDetailed}</p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {cards.map((card, index) => {
              const isExpanded = expandedCards[card.id] ?? false;

              return (
                <article
                  key={card.id}
                  className={`rounded-3xl border p-5 shadow-sm transition-all duration-300 ${typeCardClassMap[card.type]} animate-[fadeIn_0.35s_ease-out_forwards] opacity-0`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden>
                        {typeIconMap[card.type]}
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{insightTypeLabel(card.type, t)}</p>
                        <h2 className="mt-1 text-lg font-semibold text-slate-900">{card.title}</h2>
                      </div>
                    </div>
                    <PriorityBadge priority={card.priority} />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">{card.shortDescription}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCards((prev) => ({
                        ...prev,
                        [card.id]: !isExpanded,
                      }))
                    }
                    className="mt-3 rounded-lg border border-slate-300 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white"
                  >
                    {isExpanded ? t.showLess : t.learnMore}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "mt-4 max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-3 border-t border-white/70 pt-4 text-sm text-slate-700">
                      <p>{card.explanation}</p>
                      <div>
                        <p className="font-medium text-slate-900">{t.likelyCauses}</p>
                        <ul className="mt-1 list-inside list-disc space-y-1">
                          {card.possibleCauses.map((cause) => (
                            <li key={`${card.id}-cause-${cause}`}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{t.suggestionsTitle}</p>
                        <ul className="mt-1 list-inside list-disc space-y-1">
                          {card.suggestions.map((suggestion) => (
                            <li key={`${card.id}-suggestion-${suggestion}`}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

const typeCardClassMap: Record<InsightType, string> = {
  pattern: "border-[#d9d8ef] bg-[#f5f7ff]",
  behavior: "border-[#d8ddf0] bg-[#f2f5ff]",
  warning: "border-[#efd2cf] bg-[#fff3f1]",
  suggestion: "border-[#d5e8d5] bg-[#f1f9f1]",
};

const typeIconMap: Record<InsightType, string> = {
  pattern: "🧩",
  behavior: "📅",
  warning: "⚠️",
  suggestion: "💡",
};

function buildInsightCards(
  insights: PatternInsight[],
  recurring: RecurringProblemSupport[],
  language: "ru" | "en",
): InsightCard[] {
  const patternCards: InsightCard[] = insights.map((insight) => {
    const isBehavior = insight.key.startsWith("weekday-");
    const type: InsightType = isBehavior ? "behavior" : "pattern";
    const priority: InsightPriority = insight.count >= 4 ? "high" : insight.count >= 3 ? "medium" : "low";

    return {
      id: insight.key,
      type,
      priority,
      title: isBehavior
        ? language === "ru"
          ? "Паттерн по дням недели"
          : "Weekday behavior pattern"
        : language === "ru"
          ? "Повторяющийся триггер"
          : "Recurring trigger",
      shortDescription: insight.message,
      explanation: isBehavior
        ? language === "ru"
          ? "В этот день недели чаще встречается снижение настроения. Это может указывать на устойчивый поведенческий цикл."
          : "Mood drops are more frequent on this weekday, which may indicate a repeated behavioral cycle."
        : language === "ru"
          ? "Эта тема повторяется в нескольких записях и может быть ключевым источником напряжения."
          : "This topic appears across multiple entries and may be a key stress source.",
      possibleCauses:
        language === "ru"
          ? ["Накопленная усталость к концу недели", "Повторяющийся внешний триггер", "Недостаток восстановления"]
          : ["Accumulated weekly fatigue", "Recurring external trigger", "Insufficient recovery routine"],
      suggestions:
        language === "ru"
          ? ["Подготовьте короткий план разгрузки на этот день", "Снизьте один лишний обязательный пункт", "Отслеживайте эффект в течение недели"]
          : ["Prepare a short relief plan for that day", "Remove one non-essential obligation", "Track changes over the next week"],
    };
  });

  const recurringCards: InsightCard[] = recurring.map((item) => ({
    id: `recurring-${item.problem}`,
    type: item.count >= 3 ? "warning" : "suggestion",
    priority: item.count >= 4 ? "high" : item.count >= 3 ? "medium" : "low",
    title:
      language === "ru"
        ? `Ключевая тема: ${item.problem}`
        : `Key issue: ${item.problem}`,
    shortDescription: item.explanation,
    explanation:
      language === "ru"
        ? "Чем чаще тема повторяется, тем выше ее влияние на общее эмоциональное состояние."
        : "The more often this issue appears, the stronger its impact on your emotional baseline.",
    possibleCauses: [item.possibleCause],
    suggestions: item.steps,
  }));

  return [...recurringCards, ...patternCards];
}

function insightTypeLabel(type: InsightType, t: ReturnType<typeof useLanguage>["t"]) {
  if (type === "pattern") return t.insightTypePattern;
  if (type === "behavior") return t.insightTypeBehavior;
  if (type === "warning") return t.insightTypeWarning;
  return t.insightTypeSuggestion;
}

function PriorityBadge({ priority }: { priority: InsightPriority }) {
  const { t } = useLanguage();

  const priorityMap: Record<
    InsightPriority,
    {
      label: string;
      className: string;
    }
  > = {
    high: {
      label: t.priorityHigh,
      className: "border-red-200 bg-red-100 text-red-700",
    },
    medium: {
      label: t.priorityMedium,
      className: "border-amber-200 bg-amber-100 text-amber-700",
    },
    low: {
      label: t.priorityLow,
      className: "border-emerald-200 bg-emerald-100 text-emerald-700",
    },
  };

  const item = priorityMap[priority];

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${item.className}`}>{item.label}</span>;
}
