import { DiaryEntry } from "./types";
import { averageMood, legacyMoodToMoodValue, mostFrequentEmotion } from "./mood";

export interface WeeklySummary {
  headline: string;
  observations: string[];
  suggestion: string | null;
}

export function generateWeeklySummary(entries: DiaryEntry[], language: "ru" | "en"): WeeklySummary {
  const recent = [...entries]
    .filter((entry) => !entry.safetySuppressed)
    .filter((entry) => Date.now() - new Date(entry.date).getTime() <= 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  if (recent.length === 0) {
    return {
      headline: language === "ru" ? "Неделя пока без записей" : "No weekly entries yet",
      observations: [language === "ru" ? "Добавьте первую запись, чтобы увидеть динамику." : "Add your first entry to see trends."],
      suggestion: null,
    };
  }

  const avg = averageMood(recent);
  const dominantEmotion = mostFrequentEmotion(recent);
  const observations: string[] = [];

  if (avg) {
    observations.push(
      language === "ru"
        ? `Средний эмоциональный фон: ${avg} из 5.`
        : `Average emotional baseline: ${avg} out of 5.`,
    );
  }

  if (dominantEmotion) {
    observations.push(
      language === "ru"
        ? `Чаще всего встречалась эмоция: ${emotionLabelRu(dominantEmotion)}.`
        : `Most frequent emotion: ${emotionLabelEn(dominantEmotion)}.`,
    );
  } else {
    observations.push(
      language === "ru"
        ? "Выраженного доминирования одной эмоции не видно."
        : "No single dominant emotion appears in your entries.",
    );
  }

  const suggestion = deriveSuggestion(recent, language);
  return {
    headline:
      language === "ru"
        ? recent.length >= 3
          ? "Сводка за неделю"
          : "Пока мало данных за неделю"
        : recent.length >= 3
          ? "Weekly summary"
          : "Not enough data this week",
    observations,
    suggestion,
  };
}

function deriveSuggestion(entries: DiaryEntry[], language: "ru" | "en"): string | null {
  if (entries.length < 3) return null;

  const morning = entries.filter((entry) => getHour(entry.date) < 12).map((entry) => legacyMoodToMoodValue(entry.mood));
  const afternoon = entries.filter((entry) => getHour(entry.date) >= 12).map((entry) => legacyMoodToMoodValue(entry.mood));
  if (morning.length >= 2 && afternoon.length >= 2) {
    const morningAvg = mean(morning);
    const afternoonAvg = mean(afternoon);
    if (morningAvg + 0.4 < afternoonAvg) {
      return language === "ru"
        ? "Утром настроение ниже обычного — попробуйте короткую паузу и мягкий старт дня."
        : "Your mood is lower in the morning — try a short pause and a gentler start.";
    }
  }

  const values = entries.map((entry) => legacyMoodToMoodValue(entry.mood));
  const avg = mean(values);
  if (avg >= 4) {
    return language === "ru"
      ? "Неделя в целом стабильная — сохраните один полезный ритуал, который поддерживал это состояние."
      : "Your week looks stable — keep one helpful routine that supported this state.";
  }
  if (avg <= 2.2) {
    return language === "ru"
      ? "Неделя была напряженной — попробуйте снизить нагрузку и добавить один восстановительный шаг в день."
      : "This week looked heavy — reduce load and add one daily recovery step.";
  }

  return language === "ru"
    ? "Колебания настроения умеренные — продолжайте записи, чтобы точнее увидеть устойчивые паттерны."
    : "Mood variation is moderate — keep journaling to identify stronger patterns.";
}

function getHour(date: string): number {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 12;
  return parsed.getHours();
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function emotionLabelRu(emotion: ReturnType<typeof mostFrequentEmotion> extends infer T ? Exclude<T, null> : never): string {
  if (emotion === "joy") return "радость";
  if (emotion === "calm") return "спокойствие";
  if (emotion === "anxiety") return "тревога";
  if (emotion === "sadness") return "грусть";
  if (emotion === "anger") return "злость";
  return "нейтральность";
}

function emotionLabelEn(emotion: ReturnType<typeof mostFrequentEmotion> extends infer T ? Exclude<T, null> : never): string {
  if (emotion === "joy") return "joy";
  if (emotion === "calm") return "calm";
  if (emotion === "anxiety") return "anxiety";
  if (emotion === "sadness") return "sadness";
  if (emotion === "anger") return "anger";
  return "neutral";
}
