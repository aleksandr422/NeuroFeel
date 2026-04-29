import { test } from "node:test";
import assert from "node:assert/strict";
import { generateWeeklySummary } from "./summary";
import { DiaryEntry } from "./types";

function makeEntry(overrides: Partial<DiaryEntry>): DiaryEntry {
  return {
    id: overrides.id ?? "entry-id",
    date: overrides.date ?? new Date().toISOString(),
    text: overrides.text ?? "Entry",
    energy: overrides.energy ?? 3,
    manualMood: overrides.manualMood ?? "neutral",
    mood: overrides.mood ?? "neutral",
    emotions: overrides.emotions ?? ["neutral"],
    problem: overrides.problem ?? "daily stress",
    advice: overrides.advice ?? "",
    tags: overrides.tags ?? ["reflection"],
    isEdited: false,
    ...overrides,
  };
}

test("summary: empty input", () => {
  const result = generateWeeklySummary([], "ru");
  assert.equal(result.suggestion, null);
  assert.match(result.headline, /без записей|No weekly entries/);
});

test("summary: single entry has null suggestion", () => {
  const result = generateWeeklySummary([makeEntry({ mood: "happy", emotions: ["joy"] })], "ru");
  assert.equal(result.suggestion, null);
});

test("summary: tied emotions keeps no dominant winner", () => {
  const entries = [
    makeEntry({ emotions: ["joy"], mood: "happy" }),
    makeEntry({ emotions: ["anxiety"], mood: "anxious" }),
  ];
  const result = generateWeeklySummary(entries, "en");
  assert.ok(result.observations.some((line) => line.includes("No single dominant emotion")));
});

test("summary: all positive week yields supportive keep-routine suggestion", () => {
  const entries = [
    makeEntry({ mood: "happy", emotions: ["joy"] }),
    makeEntry({ mood: "happy", emotions: ["joy"] }),
    makeEntry({ mood: "happy", emotions: ["calm"] }),
    makeEntry({ mood: "neutral", emotions: ["calm"] }),
  ];
  const result = generateWeeklySummary(entries, "en");
  assert.ok(result.suggestion?.includes("stable"));
});

test("summary: all negative week yields recovery suggestion", () => {
  const entries = [
    makeEntry({ mood: "sad", emotions: ["sadness"] }),
    makeEntry({ mood: "anxious", emotions: ["anxiety"] }),
    makeEntry({ mood: "angry", emotions: ["anger"] }),
    makeEntry({ mood: "sad", emotions: ["sadness"] }),
  ];
  const result = generateWeeklySummary(entries, "ru");
  assert.ok(result.suggestion?.includes("нагрузку"));
});

test("summary: mixed week with lower morning mood yields morning pause suggestion", () => {
  const today = new Date();
  const morning1 = new Date(today);
  morning1.setHours(8, 0, 0, 0);
  const morning2 = new Date(today);
  morning2.setDate(today.getDate() - 1);
  morning2.setHours(9, 0, 0, 0);
  const afternoon1 = new Date(today);
  afternoon1.setHours(16, 0, 0, 0);
  const afternoon2 = new Date(today);
  afternoon2.setDate(today.getDate() - 1);
  afternoon2.setHours(17, 0, 0, 0);

  const entries = [
    makeEntry({ date: morning1.toISOString(), mood: "sad", emotions: ["sadness"] }),
    makeEntry({ date: morning2.toISOString(), mood: "anxious", emotions: ["anxiety"] }),
    makeEntry({ date: afternoon1.toISOString(), mood: "happy", emotions: ["joy"] }),
    makeEntry({ date: afternoon2.toISOString(), mood: "happy", emotions: ["joy"] }),
  ];
  const result = generateWeeklySummary(entries, "ru");
  assert.ok(result.suggestion?.includes("Утром"));
});
