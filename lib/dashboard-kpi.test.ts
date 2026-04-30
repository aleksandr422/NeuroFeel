import test from "node:test";
import assert from "node:assert/strict";
import { buildKpis } from "./dashboard";
import { DiaryEntry } from "./types";

function makeEntry(partial: Partial<DiaryEntry> & Pick<DiaryEntry, "id" | "date">): DiaryEntry {
  return {
    id: partial.id,
    version: 2,
    date: partial.date,
    text: partial.text ?? "sample",
    mood: partial.mood ?? "neutral",
    manualMood: partial.manualMood ?? "neutral",
    energy: partial.energy ?? 3,
    isEdited: false,
    emotions: partial.emotions ?? [],
    problem: "",
    advice: "",
    tags: [],
  };
}

test("avg mood KPI shows honest empty state when <3 entries", () => {
  const entries = [makeEntry({ id: "1", date: "2026-04-30T10:00:00.000Z", mood: "happy" })];
  const kpis = buildKpis(entries);
  assert.equal(kpis.avgMood.value, "—");
  assert.equal(kpis.avgMood.caption, "Недостаточно данных");
});

test("delta KPI requires two weeks and does not show +0.0", () => {
  const entries = [
    makeEntry({ id: "1", date: "2026-04-30T10:00:00.000Z", mood: "neutral" }),
    makeEntry({ id: "2", date: "2026-04-23T10:00:00.000Z", mood: "neutral" }),
  ];
  const kpis = buildKpis(entries);
  assert.equal(kpis.delta.value, "—");
  assert.equal(kpis.delta.caption, "Нужна ещё одна неделя данных");
});

test("top emotion KPI does not silently pick on tie", () => {
  const entries = [
    makeEntry({ id: "1", date: "2026-04-30T10:00:00.000Z", emotions: ["calm"] }),
    makeEntry({ id: "2", date: "2026-04-29T10:00:00.000Z", emotions: ["joy"] }),
  ];
  const kpis = buildKpis(entries);
  assert.equal(kpis.emotion.value, "Несколько");
  assert.match(kpis.emotion.caption, /calm|joy/);
});
