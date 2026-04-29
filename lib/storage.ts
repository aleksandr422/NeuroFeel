"use client";

import { AIPersonality, ChatMessage, DiaryEntry, UserPreferences } from "@/lib/types";
import { ENTRY_SCHEMA_VERSION, migrateEntry } from "@/lib/migrations";

const STORAGE_KEY = "ai-mood-diary-entries-v1";
const PIN_KEY = "ai-mood-diary-pin-v1";
const PIN_HASH_KEY = "ai-mood-diary-pin-hash-v1";
const PREFERENCES_KEY = "ai-mood-diary-user-preferences-v1";
const CHAT_MESSAGES_KEY = "ai-mood-diary-chat-messages-v1";
const AI_PERSONALITY_KEY = "ai-mood-diary-ai-personality-v1";
const AUTH_KEY = "minddiary.auth.isAuthenticated";
const ONBOARDING_KEY = "minddiary.onboarding.completedAt";
const FLASH_MESSAGE_KEY = "minddiary.flash";
const LAST_EXPORT_KEY = "minddiary.backup.lastExportAt";
const EXPORT_REMINDER_HIDE_UNTIL_KEY = "minddiary.backup.hideUntil";

export function getEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return parsed
      .map((entry) =>
        migrateEntry({
          ...entry,
          version: entry.version ?? 1,
          isEdited: entry.isEdited ?? false,
        }),
      )
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
  saveEntries([{ ...entry, version: entry.version ?? ENTRY_SCHEMA_VERSION }, ...current]);
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
  localStorage.removeItem(PREFERENCES_KEY);
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(PIN_HASH_KEY);
  localStorage.removeItem(CHAT_MESSAGES_KEY);
  localStorage.removeItem(AI_PERSONALITY_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
}

export function exportEntriesJson() {
  const profile = getUserPreferences();
  const payload =
    profile?.ageGroup === "under_18"
      ? {
          exportedFrom: "MindDiary",
          note: "Personal mood entries. Treat with care.",
          entries: getEntries(),
        }
      : getEntries();
  return JSON.stringify(payload, null, 2);
}

export function markExportedNow() {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_EXPORT_KEY, new Date().toISOString());
  localStorage.removeItem(EXPORT_REMINDER_HIDE_UNTIL_KEY);
}

export function shouldShowExportReminder(now = new Date()): boolean {
  if (typeof window === "undefined") return false;
  const hideUntilRaw = localStorage.getItem(EXPORT_REMINDER_HIDE_UNTIL_KEY);
  if (hideUntilRaw) {
    const hideUntil = new Date(hideUntilRaw);
    if (!Number.isNaN(hideUntil.getTime()) && now < hideUntil) return false;
  }
  const lastRaw = localStorage.getItem(LAST_EXPORT_KEY);
  if (!lastRaw) return true;
  const last = new Date(lastRaw);
  if (Number.isNaN(last.getTime())) return true;
  return now.getTime() - last.getTime() > 30 * 24 * 60 * 60 * 1000;
}

export function dismissExportReminderFor30Days(now = new Date()) {
  if (typeof window === "undefined") return;
  const next = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  localStorage.setItem(EXPORT_REMINDER_HIDE_UNTIL_KEY, next.toISOString());
}

export function importEntriesJson(json: string) {
  const parsed = JSON.parse(json) as DiaryEntry[] | { entries: DiaryEntry[] };
  const entries = Array.isArray(parsed) ? parsed : parsed.entries;
  if (!Array.isArray(entries)) {
    throw new Error("Invalid JSON format");
  }
  saveEntries(entries);
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

type PinHashRecord = {
  salt: string;
  hash: string;
  iterations: number;
};

export async function setPinHash(pin: string) {
  if (typeof window === "undefined") return;
  if (!pin) {
    localStorage.removeItem(PIN_HASH_KEY);
    localStorage.removeItem(PIN_KEY);
    return;
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 200000;
  const hash = await derivePinHash(pin, salt, iterations);
  const record: PinHashRecord = {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    iterations,
  };
  localStorage.setItem(PIN_HASH_KEY, JSON.stringify(record));
  localStorage.removeItem(PIN_KEY);
}

export function getPinHashRecord(): PinHashRecord | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PIN_HASH_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PinHashRecord;
    if (!parsed?.salt || !parsed?.hash || !parsed?.iterations) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function derivePinHash(pin: string, salt: Uint8Array, iterations: number) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as unknown as BufferSource,
      iterations,
    },
    keyMaterial,
    256,
  );
  return new Uint8Array(bits);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
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

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthenticated(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(AUTH_KEY, "1");
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getOnboardingCompletedAt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ONBOARDING_KEY);
}

export function completeOnboarding() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_KEY, new Date().toISOString());
}

export function resetOnboarding() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_KEY);
}

export function setFlashMessage(message: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FLASH_MESSAGE_KEY, message);
}

export function consumeFlashMessage(): string | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(FLASH_MESSAGE_KEY);
  if (!value) return null;
  localStorage.removeItem(FLASH_MESSAGE_KEY);
  return value;
}
