import { readFileSync } from "node:fs";

const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();

const lexicon = readFileSync(new URL("../lib/safety/crisisLexicon.ts", import.meta.url), "utf8");
const lexMatch = lexicon.match(/lastReviewedAt:\s*"(\d{4}-\d{2}-\d{2})"/);
if (!lexMatch) {
  console.error("Could not read crisis lexicon review date.");
  process.exit(1);
}
const lexDate = new Date(lexMatch[1]).getTime();
if (now - lexDate > 180 * dayMs) {
  console.error("Safety lexicon review is older than 180 days.");
  process.exit(1);
}

const resources = readFileSync(new URL("../lib/safety/resources.ts", import.meta.url), "utf8");
const resourceDates = [...resources.matchAll(/lastVerifiedAt:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((item) => item[1]);
if (!resourceDates.length) {
  console.error("Could not read safety resource verification dates.");
  process.exit(1);
}
const stale = resourceDates.some((value) => now - new Date(value).getTime() > 90 * dayMs);
if (stale) {
  console.error("Safety resources verification is older than 90 days.");
  process.exit(1);
}

console.log("Safety freshness checks passed.");
