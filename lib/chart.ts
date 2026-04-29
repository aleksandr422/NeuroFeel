import { DiaryEntry } from "./types";
import { legacyMoodToMoodValue } from "./mood";

export type TrendPoint = {
  key: string;
  label: string;
  score: number;
  entries: Array<{ id: string; timeLabel: string; score: number }>;
};

export function aggregateMoodTrend(entries: DiaryEntry[], language: "ru" | "en"): TrendPoint[] {
  const locale = language === "ru" ? "ru-RU" : "en-US";
  const grouped = new Map<string, DiaryEntry[]>();
  entries.forEach((entry) => {
    const date = new Date(entry.date);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toISOString().slice(0, 10);
    const bucket = grouped.get(key) ?? [];
    bucket.push(entry);
    grouped.set(key, bucket);
  });

  const keys = [...grouped.keys()].sort((a, b) => (a > b ? 1 : -1));
  const formatter = createAdaptiveDateFormatter(keys, locale);
  return keys.map((key) => {
    const bucket = grouped.get(key) ?? [];
    const detailed = bucket.map((entry) => {
      const date = new Date(entry.date);
      return {
        id: entry.id,
        timeLabel: new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(date),
        score: legacyMoodToMoodValue(entry.mood),
      };
    });
    const avg = detailed.length ? detailed.reduce((sum, item) => sum + item.score, 0) / detailed.length : 0;
    return {
      key,
      label: formatter(new Date(key)),
      score: Number(avg.toFixed(2)),
      entries: detailed,
    };
  });
}

function createAdaptiveDateFormatter(keys: string[], locale: string) {
  if (keys.length <= 1) {
    return (date: Date) => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(date);
  }
  const first = new Date(keys[0] ?? "");
  const last = new Date(keys[keys.length - 1] ?? "");
  const days = Math.max(1, Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)));
  if (days <= 14) {
    const format = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" });
    return (date: Date) => format.format(date);
  }
  if (days <= 90) {
    const format = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" });
    return (date: Date) => format.format(date);
  }
  const format = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" });
  return (date: Date) => format.format(date);
}
