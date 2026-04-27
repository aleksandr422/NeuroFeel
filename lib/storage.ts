"use client";

import { AIPersonality, ChatMessage, DiaryEntry, UserPreferences } from "@/lib/types";

const STORAGE_KEY = "ai-mood-diary-entries-v1";
const PIN_KEY = "ai-mood-diary-pin-v1";
const PREFERENCES_KEY = "ai-mood-diary-user-preferences-v1";
const CHAT_MESSAGES_KEY = "ai-mood-diary-chat-messages-v1";
const AI_PERSONALITY_KEY = "ai-mood-diary-ai-personality-v1";

export function getEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return parsed
      .map((entry) => ({
        ...entry,
        isEdited: entry.isEdited ?? false,
      }))
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  } catch {
    return [];
  }
}

export function saveEntries(entries: DiaryEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: DiaryEntry) {
  const current = getEntries();
  saveEntries([entry, ...current]);
}

export function updateEntry(entryId: string, updates: Partial<DiaryEntry>) {
  const current = getEntries();
  const next = current.map((entry) =>
    entry.id === entryId
      ? {
          ...entry,
          ...updates,
        }
      : entry,
  );
  saveEntries(next);
  return next;
}

export function deleteEntry(entryId: string) {
  const current = getEntries();
  const next = current.filter((entry) => entry.id !== entryId);
  saveEntries(next);
  return next;
}

export function clearAllEntries() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportEntriesJson() {
  return JSON.stringify(getEntries(), null, 2);
}

export function importEntriesJson(json: string) {
  const parsed = JSON.parse(json) as DiaryEntry[];
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid JSON format");
  }
  saveEntries(parsed);
}

export function setPin(pin: string) {
  if (typeof window === "undefined") return;
  if (!pin) {
    localStorage.removeItem(PIN_KEY);
    return;
  }
  localStorage.setItem(PIN_KEY, pin);
}

export function getPin() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PIN_KEY) ?? "";
}

export function getUserPreferences(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PREFERENCES_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as UserPreferences;
    if (!parsed || typeof parsed !== "object") return null;
    const allowedLifestyle = new Set<UserPreferences["lifestyle"]>([
      "student",
      "working",
      "mixed",
      "unemployed",
      "freelancer",
      "entrepreneur",
      "parental_leave",
      "school_student",
    ]);
    const allowedHelps = new Set<NonNullable<UserPreferences["helps"]>[number]>([
      "sport",
      "music",
      "walking",
      "talking_to_friends",
      "games",
    ]);
    const allowedSupportStyles = new Set<NonNullable<UserPreferences["supportStyles"]>[number]>([
      "supportive_friend",
      "motivational",
      "reflective",
      "practical_advice",
      "short_direct",
      "calm_gentle",
      "deep_reflection",
    ]);
    const legacySupportStyle = (parsed as { supportStyle?: string }).supportStyle;
    const migratedLegacySupportStyle =
      legacySupportStyle === "supportive_soft"
        ? "supportive_friend"
        : legacySupportStyle === "direct_advice"
          ? "practical_advice"
          : legacySupportStyle === "short_answers"
            ? "short_direct"
            : undefined;
    return {
      interests: Array.isArray(parsed.interests) ? parsed.interests.filter((v): v is string => typeof v === "string") : [],
      lifestyle: allowedLifestyle.has(parsed.lifestyle) ? parsed.lifestyle : "mixed",
      goals: typeof parsed.goals === "string" ? parsed.goals : "",
      helps: Array.isArray(parsed.helps) ? parsed.helps.filter((v): v is NonNullable<UserPreferences["helps"]>[number] => allowedHelps.has(v)) : [],
      supportStyles: Array.isArray(parsed.supportStyles)
        ? parsed.supportStyles
            .filter((v): v is NonNullable<UserPreferences["supportStyles"]>[number] => allowedSupportStyles.has(v))
            .slice(0, 2)
        : migratedLegacySupportStyle
          ? [migratedLegacySupportStyle]
          : [],
      avoidSuggestions: typeof parsed.avoidSuggestions === "string" ? parsed.avoidSuggestions : "",
      ageGroup:
        parsed.ageGroup === "under_18" || parsed.ageGroup === "18_25" || parsed.ageGroup === "25_40" || parsed.ageGroup === "40_plus"
          ? parsed.ageGroup
          : undefined,
      gender:
        parsed.gender === "male" || parsed.gender === "female" || parsed.gender === "prefer_not_to_say"
          ? parsed.gender
          : undefined,
    };
  } catch {
    return null;
  }
}

export function saveUserPreferences(preferences: UserPreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export function getChatMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ChatMessage => {
      return (
        typeof item?.id === "string" &&
        (item?.role === "user" || item?.role === "assistant") &&
        typeof item?.content === "string" &&
        typeof item?.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
}

export function clearChatMessages() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAT_MESSAGES_KEY);
}

export function getAIPersonality(): AIPersonality {
  if (typeof window === "undefined") return "supportive";
  const raw = localStorage.getItem(AI_PERSONALITY_KEY);
  if (raw === "supportive" || raw === "motivational" || raw === "calm" || raw === "analytical") {
    return raw;
  }
  return "supportive";
}

export function saveAIPersonality(personality: AIPersonality) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AI_PERSONALITY_KEY, personality);
}
