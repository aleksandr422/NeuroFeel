import { legacyMoodToMoodValue, moodToEmoji } from "./mood";
import { DiaryEntry } from "./types";
import { isLikelyMeaningful } from "./validation";

export function buildKpis(entries: DiaryEntry[]) {
  const week = entries.filter((entry) => dayDiff(new Date(), new Date(entry.date)) < 7);
  const avgValue = week.length >= 3 ? Number((week.reduce((sum, entry) => sum + legacyMoodToMoodValue(entry.mood), 0) / week.length).toFixed(1)) : null;
  const currentWeek = entries.filter((entry) => dayDiff(new Date(), new Date(entry.date)) < 7);
  const prevWeek = entries.filter((entry) => {
    const diff = dayDiff(new Date(), new Date(entry.date));
    return diff >= 7 && diff < 14;
  });
  const deltaReady = entries.length >= 14;
  const thisAvg = currentWeek.length ? currentWeek.reduce((sum, item) => sum + legacyMoodToMoodValue(item.mood), 0) / currentWeek.length : 0;
  const prevAvg = prevWeek.length ? prevWeek.reduce((sum, item) => sum + legacyMoodToMoodValue(item.mood), 0) / prevWeek.length : 0;
  const delta = deltaReady ? Number((thisAvg - prevAvg).toFixed(1)) : null;

  const emotionCounts = new Map<string, number>();
  entries.forEach((entry) => entry.emotions.forEach((emotion) => emotionCounts.set(emotion, (emotionCounts.get(emotion) ?? 0) + 1)));
  const sorted = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topCount = sorted[0]?.[1] ?? 0;
  const topItems = sorted.filter((item) => item[1] === topCount);
  const topEmotionLabel = topItems.length === 1 ? topItems[0][0] : topItems.length > 1 ? "Несколько" : "—";
  const streak = calcStreak(entries);
  const streakMilestone = nextStreakMilestone(streak);
  return {
    avgMood: {
      value: avgValue ? `${avgValue} / 5` : "—",
      caption: avgValue ? "за последние 7 дней" : "Недостаточно данных",
      progress: avgValue ? avgValue / 5 : 0,
      ariaLabel: `Среднее настроение, ${avgValue ?? "недостаточно данных"} из 5, за последние 7 дней`,
    },
    delta: {
      value: deltaReady && delta !== null ? `${delta > 0 ? "+" : ""}${delta}` : "—",
      caption: deltaReady ? "vs предыдущая неделя" : "Нужна ещё одна неделя данных",
      progress: deltaReady ? Math.min(Math.abs(delta ?? 0) / 2, 1) : 0,
      icon: delta && delta > 0 ? ("up" as const) : delta && delta < 0 ? ("down" as const) : undefined,
      valueClass: delta && delta > 0 ? "text-[var(--color-success-500)]" : delta && delta < 0 ? "text-[var(--color-warning-500)]" : "",
      ariaLabel: `Изменение за неделю, ${deltaReady ? delta : "данных недостаточно"}`,
    },
    emotion: {
      value: topEmotionLabel,
      caption: topItems.length === 1 ? `${topCount} из ${entries.length} записей` : topItems.length ? topItems.map((item) => item[0]).join(", ") : "Недостаточно данных",
      progress: topCount && entries.length ? topCount / entries.length : 0,
      emoji: topItems.length === 1 ? "🙂" : "😐",
      ariaLabel: `Самая частая эмоция, ${topEmotionLabel}`,
    },
    streak: {
      value: String(streak),
      caption: streak < 3 ? "Запишите 3 дня подряд, чтобы начать серию" : "дней подряд",
      progress: streak / streakMilestone,
      ariaLabel: `Серия дней, ${streak} дней подряд`,
    },
  };
}

export function getRecentEntryMoodMarker(entry: DiaryEntry, language: "ru" | "en"): string {
  if (!isLikelyMeaningful(entry.text, language)) return "—";
  return moodToEmoji(legacyMoodToMoodValue(entry.mood));
}

function calcStreak(entries: DiaryEntry[]): number {
  const days = [...new Set(entries.map((entry) => entry.date.slice(0, 10)))].sort((a, b) => (a > b ? -1 : 1));
  if (!days.length) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i += 1) {
    const prev = new Date(`${days[i - 1]}T00:00:00`);
    const next = new Date(`${days[i]}T00:00:00`);
    if (dayDiff(prev, next) === 1) {
      streak += 1;
      continue;
    }
    break;
  }
  return streak;
}

function nextStreakMilestone(streak: number) {
  if (streak < 3) return 3;
  if (streak < 7) return 7;
  if (streak < 14) return 14;
  return 30;
}

function dayDiff(a: Date, b: Date) {
  return Math.floor(Math.abs(a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));
}
