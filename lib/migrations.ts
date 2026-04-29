import { DiaryEntry } from "@/lib/types";
import { legacyMoodToMoodValue, moodValueToLegacyMood } from "@/lib/mood";

export const ENTRY_SCHEMA_VERSION = 2;

export function migrateEntry(entry: DiaryEntry): DiaryEntry {
  const currentVersion = entry.version ?? 1;
  if (currentVersion >= ENTRY_SCHEMA_VERSION) return entry;

  const canonicalMood = legacyMoodToMoodValue(entry.manualMood);
  return {
    ...entry,
    manualMood: moodValueToLegacyMood(canonicalMood),
    mood: moodValueToLegacyMood(legacyMoodToMoodValue(entry.mood)),
    energy: Math.min(5, Math.max(1, Math.round(entry.energy || 3))),
    version: ENTRY_SCHEMA_VERSION,
  };
}
