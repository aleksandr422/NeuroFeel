import { test } from "node:test";
import assert from "node:assert/strict";
import { isLikelyMeaningful } from "./validation";

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
