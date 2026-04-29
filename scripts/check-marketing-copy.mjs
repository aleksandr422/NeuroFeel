import { readFileSync } from "node:fs";

const banned = [
  /понимает тебя/gi,
  /ИИ-дневник/gi,
  /персональные инсайты от ИИ/gi,
  /ИИ анализирует настроение/gi,
  /получай бережные рекомендации, адаптированные под тебя/gi,
  /understands you/gi,
  /AI-powered insights/gi,
];

const content = readFileSync(new URL("../lib/i18n.ts", import.meta.url), "utf8");
const matches = banned.filter((regex) => regex.test(content));

if (matches.length) {
  console.error("Marketing copy audit failed: banned mental-health overpromise phrase detected.");
  console.error("Reason: the product notices patterns, it does not 'understand' users.");
  process.exit(1);
}

console.log("Marketing copy audit passed.");
