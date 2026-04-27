import { DiaryEntry, PatternInsight, RecurringProblemSupport } from "@/lib/types";
import { Language } from "@/lib/i18n";
import { localizeProblem } from "@/lib/localize";

export function detectPatterns(entries: DiaryEntry[], language: Language): PatternInsight[] {
  const insights: PatternInsight[] = [];
  if (!entries.length) return insights;

  const problemCounts = new Map<string, number>();
  const weekdayLowMood = new Map<string, number>();

  for (const entry of entries) {
    if (entry.problem) {
      const key = entry.problem.toLowerCase();
      problemCounts.set(key, (problemCounts.get(key) ?? 0) + 1);
    }

    const day = new Date(entry.date).toLocaleDateString(language === "ru" ? "ru-RU" : "en-US", { weekday: "long" });
    if (entry.mood === "sad" || entry.mood === "anxious" || entry.mood === "angry") {
      weekdayLowMood.set(day, (weekdayLowMood.get(day) ?? 0) + 1);
    }
  }

  for (const [problem, count] of problemCounts.entries()) {
    if (count >= 2) {
      const label = localizeProblem(problem, language);
      insights.push({
        key: `problem-${problem}`,
        count,
        message:
          language === "ru"
            ? `Вы несколько раз упомянули "${label}". Попробуйте спокойно обсудить это и обозначить четкие границы.`
            : `You mentioned "${label}" multiple times. Consider discussing this calmly and setting clear boundaries.`,
      });
    }
  }

  for (const [day, count] of weekdayLowMood.entries()) {
    if (count >= 2) {
      insights.push({
        key: `weekday-${day}`,
        count,
        message:
          language === "ru"
            ? `Судя по записям, настроение чаще снижается в ${day}.`
            : `According to your entries, your mood often drops on ${day}s.`,
      });
    }
  }

  return insights;
}

export function getRecurringProblemSupport(entries: DiaryEntry[], language: Language): RecurringProblemSupport[] {
  const counts = new Map<string, number>();
  entries.forEach((e) => {
    if (e.problem) {
      const key = e.problem.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  });

  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([problem, count]) => ({
      problem,
      count,
      explanation:
        language === "ru"
          ? `Эта тема встречается в дневнике ${count} раз(а) и может быть повторяющимся стресс-паттерном.`
          : `This issue appears in your diary ${count} times and may be a repeating stress pattern.`,
      possibleCause:
        language === "ru"
          ? "Неразрешенные ожидания, пробелы в коммуникации или повторяющееся рабочее давление."
          : "Unresolved expectations, communication gaps, or recurring workload pressure.",
      steps:
        language === "ru"
          ? [
              "Опишите один конкретный триггер и когда он возникает.",
              "Установите одну практичную границу или рутину, чтобы снизить влияние триггера.",
              "Через неделю оцените результат и скорректируйте подход.",
            ]
          : [
              "Describe one specific trigger and when it happens.",
              "Set one practical boundary or routine to reduce the trigger.",
              "Review the result after one week and adjust your approach.",
            ],
    }));
}
