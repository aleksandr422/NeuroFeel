import test from "node:test";
import assert from "node:assert/strict";
import { detectCrisisSignals } from "./detector";

test("detects explicit suicidal ideation in ru", () => {
  const result = detectCrisisSignals("Я не хочу жить и не вижу смысла жить", "ru");
  assert.equal(result.length > 0, true);
});

test("detects self-harm in en", () => {
  const result = detectCrisisSignals("I want to self-harm tonight", "en");
  assert.equal(result.some((item) => item.category === "self_harm"), true);
});

test("does not trigger on ambiguous fatigue phrase", () => {
  const result = detectCrisisSignals("я так устал от всего этого", "ru");
  assert.equal(result.length, 0);
});

test("requires hopelessness and finality pair", () => {
  assert.equal(detectCrisisSignals("мне безысходно", "ru").length, 0);
  assert.equal(detectCrisisSignals("мне безысходно, это конец", "ru").some((item) => item.category === "hopelessness_finality"), true);
});
