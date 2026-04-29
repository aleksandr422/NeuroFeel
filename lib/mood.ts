import { DiaryEntry, Mood as LegacyMood } from "./types";

export const MOOD_SCALE_MAX = 5 as const;

export type Mood = 1 | 2 | 3 | 4 | 5;
export type Energy = 1 | 2 | 3 | 4 | 5;
export type Emotion = "joy" | "calm" | "anxiety" | "sadness" | "anger" | "neutral";

export function moodToEmoji(mood: Mood): string {
  if (mood <= 1) return "😞";
  if (mood === 2) return "😕";
  if (mood === 3) return "😐";
  if (mood === 4) return "🙂";
  return "😄";
}

export function moodToColor(mood: Mood): string {
  if (mood <= 1) return "#7c3aed";
  if (mood === 2) return "#8b5cf6";
  if (mood === 3) return "#a78bfa";
  if (mood === 4) return "#7b8cff";
  return "#6d5ef5";
}

export function legacyMoodToMoodValue(mood: LegacyMood): Mood {
  if (mood === "sad") return 1;
  if (mood === "anxious" || mood === "angry" || mood === "tired") return 2;
  if (mood === "neutral") return 3;
  return 5;
}

export function moodValueToLegacyMood(mood: Mood): LegacyMood {
  if (mood <= 1) return "sad";
  if (mood === 2) return "anxious";
  if (mood === 3) return "neutral";
  return "happy";
}

export function averageMood(entries: DiaryEntry[]): Mood | null {
  if (!entries.length) return null;
  const avg = entries.reduce((sum, entry) => sum + legacyMoodToMoodValue(entry.mood), 0) / entries.length;
  const rounded = Math.round(avg);
  return clampMood(rounded);
}

function toCanonicalEmotion(raw: string): Emotion | null {
  const key = raw.trim().toLowerCase();
  if (key === "joy" || key === "happy" || key === "happiness") return "joy";
  if (key === "calm" || key === "neutral" || key === "calmness") return "calm";
  if (key === "anxiety" || key === "anxious" || key === "stress") return "anxiety";
  if (key === "sadness" || key === "sad") return "sadness";
  if (key === "anger" || key === "angry") return "anger";
  if (key === "neutral") return "neutral";
  return null;
}

export function mostFrequentEmotion(entries: DiaryEntry[]): Emotion | null {
  const counts = new Map<Emotion, number>();
  entries.forEach((entry) => {
    entry.emotions.forEach((emotion) => {
      const canonical = toCanonicalEmotion(emotion);
      if (!canonical) return;
      counts.set(canonical, (counts.get(canonical) ?? 0) + 1);
    });
  });

  if (!counts.size) return null;
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (!sorted[0]) return null;
  const topCount = sorted[0][1];
  const topItems = sorted.filter(([, count]) => count === topCount);
  if (topItems.length !== 1) return null;
  return topItems[0]?.[0] ?? null;
}

function clampMood(value: number): Mood {
  if (value <= 1) return 1;
  if (value >= 5) return 5;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
}
