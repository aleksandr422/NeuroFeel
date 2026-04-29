import { CRISIS_LEXICON } from "./crisisLexicon";
import { SAFETY_RESOURCES } from "./resources";

const DAY_MS = 24 * 60 * 60 * 1000;

export function isLexiconReviewFresh(now = new Date()): boolean {
  const last = new Date(CRISIS_LEXICON.lastReviewedAt);
  if (Number.isNaN(last.getTime())) return false;
  return now.getTime() - last.getTime() <= 180 * DAY_MS;
}

export function areResourcesFresh(now = new Date()): boolean {
  const all = [...SAFETY_RESOURCES.en, ...SAFETY_RESOURCES.ru];
  return all.every((item) => {
    const date = new Date(item.lastVerifiedAt);
    if (Number.isNaN(date.getTime())) return false;
    return now.getTime() - date.getTime() <= 90 * DAY_MS;
  });
}
