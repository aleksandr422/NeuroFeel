import test from "node:test";
import assert from "node:assert/strict";
import { areResourcesFresh, isLexiconReviewFresh } from "./reviewGuard";

test("lexicon review date is within 180 days", () => {
  assert.equal(isLexiconReviewFresh(), true);
});

test("resource verification date is within 90 days", () => {
  assert.equal(areResourcesFresh(), true);
});
