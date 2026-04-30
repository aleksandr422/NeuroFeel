import { DiaryEntry } from "./types";
import { legacyMoodToMoodValue, moodValueToLegacyMood } from "./mood";
import { isLikelyMeaningful } from "./validation";

export const ENTRY_SCHEMA_VERSION = 2;

export function migrateEntry(entry: DiaryEntry): DiaryEntry {
  const currentVersion = entry.version ?? 1;
  const migrated = currentVersion >= ENTRY_SCHEMA_VERSION
    ? entry
    : {
        ...entry,
        manualMood: moodValueToLegacyMood(legacyMoodToMoodValue(entry.manualMood)),
        mood: moodValueToLegacyMood(legacyMoodToMoodValue(entry.mood)),
        energy: Math.min(5, Math.max(1, Math.round(entry.energy || 3))),
        version: ENTRY_SCHEMA_VERSION,
      };

  if (!isLikelyMeaningful(migrated.text, detectLocale(migrated.text))) {
    return {
      ...migrated,
      mood: migrated.manualMood,
      emotions: [],
      emotionLabels: [],
      tags: [],
      tagLabels: [],
      tagConfidences: [],
      problem: "",
      problemLabel: "",
      message: "",
      advice: "",
    };
  }
  return migrated;
}

function detectLocale(text: string): "ru" | "en" {
  return /[а-яё]/i.test(text) ? "ru" : "en";
}
