import { test } from "node:test";
import assert from "node:assert/strict";
import { isLikelyMeaningful } from "./validation";
import { migrateEntry } from "./migrations";
import { getRecentEntryMoodMarker } from "./dashboard";
import { DiaryEntry } from "./types";

test("validation: keyboard mash rejected", () => {
  assert.equal(isLikelyMeaningful("ромпгмглмгщм ромпгмглмгщм", "ru"), false);
});

test("validation: single repeated word rejected", () => {
  assert.equal(isLikelyMeaningful("плохо плохо плохо плохо плохо", "ru"), false);
});

test("validation: short real entry accepted", () => {
  assert.equal(isLikelyMeaningful("Сегодня устал, был тяжёлый день", "ru"), true);
});

test("validation: long entry accepted", () => {
  assert.equal(
    isLikelyMeaningful("Сегодня на работе было сложно, но разговор с коллегой помог собраться и стало спокойнее вечером", "ru"),
    true,
  );
});

test("validation: mixed-language entry accepted", () => {
  assert.equal(isLikelyMeaningful("Today был сложный day на работе, но после walk стало лучше", "en"), true);
});

test("integration: gibberish entry renders without mood emoji and tags", () => {
  const raw: DiaryEntry = {
    id: "bad-1",
    date: "2026-04-30T12:00:00.000Z",
    version: 1,
    text: "ромпгмглмгщм ромпгмглмгщм",
    mood: "happy",
    manualMood: "neutral",
    energy: 3,
    isEdited: false,
    emotions: ["joy"],
    tags: ["work"],
    tagConfidences: [0.9],
    problem: "workload",
    advice: "test",
  };
  const migrated = migrateEntry(raw);
  assert.equal(getRecentEntryMoodMarker(migrated, "ru"), "—");
  assert.deepEqual(migrated.tags, []);
});
