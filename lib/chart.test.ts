import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregateMoodTrend } from "./chart";
import { DiaryEntry } from "./types";

function entry(id: string, date: string, mood: DiaryEntry["mood"]): DiaryEntry {
  return {
    id,
    date,
    text: "text",
    energy: 3,
    manualMood: "neutral",
    mood,
    emotions: ["neutral"],
    problem: "daily stress",
    advice: "",
    tags: [],
    isEdited: false,
  };
}

test("trend: one entry returns one point", () => {
  const points = aggregateMoodTrend([entry("1", "2026-04-29T10:00:00.000Z", "happy")], "ru");
  assert.equal(points.length, 1);
});

test("trend: multiple entries same day aggregated", () => {
  const points = aggregateMoodTrend(
    [
      entry("1", "2026-04-29T08:00:00.000Z", "sad"),
      entry("2", "2026-04-29T18:00:00.000Z", "happy"),
    ],
    "ru",
  );
  assert.equal(points.length, 1);
  assert.equal(points[0]?.entries.length, 2);
});

test("trend: entries across 3 days produce 3 points", () => {
  const points = aggregateMoodTrend(
    [
      entry("1", "2026-04-27T08:00:00.000Z", "sad"),
      entry("2", "2026-04-28T08:00:00.000Z", "neutral"),
      entry("3", "2026-04-29T08:00:00.000Z", "happy"),
    ],
    "ru",
  );
  assert.equal(points.length, 3);
});

test("trend: entries across 60 days use adaptive labels", () => {
  const points = aggregateMoodTrend(
    [
      entry("1", "2026-01-01T08:00:00.000Z", "sad"),
      entry("2", "2026-03-01T08:00:00.000Z", "happy"),
    ],
    "en",
  );
  assert.equal(points.length, 2);
  assert.ok(points[0]?.label.length > 0);
});
