import commonWords from "./commonWords.json";

const COMMON = new Set<string>(commonWords.map((item) => item.toLowerCase()));
const RU_VOWELS = new Set(Array.from("аеёиоуыэюя"));
const EN_VOWELS = new Set(Array.from("aeiouy"));

export function isLikelyMeaningful(text: string, locale: "ru" | "en"): boolean {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length < 15) return false;

  const tokens = compact
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter((token) => token.length >= 2);
  const distinctTokens = new Set(tokens);
  if (distinctTokens.size < 3) return false;

  if (!hasSaneVowelRatio(compact.toLowerCase(), locale)) return false;
  if (hasOverRepeatedCharacter(compact.toLowerCase())) return false;
  if (hasOverRepeatedBigram(compact.toLowerCase())) return false;
  if (!tokens.some((token) => COMMON.has(token))) return false;

  return true;
}

function hasSaneVowelRatio(text: string, locale: "ru" | "en"): boolean {
  const letters = Array.from(text).filter((char) => /\p{L}/u.test(char));
  if (!letters.length) return false;
  const vowels = letters.filter((char) => {
    if (locale === "ru") return RU_VOWELS.has(char) || EN_VOWELS.has(char);
    return EN_VOWELS.has(char) || RU_VOWELS.has(char);
  }).length;
  const ratio = vowels / letters.length;
  return ratio >= 0.25 && ratio <= 0.7;
}

function hasOverRepeatedCharacter(text: string): boolean {
  const chars = Array.from(text).filter((char) => /\p{L}/u.test(char));
  if (!chars.length) return true;
  const counts = new Map<string, number>();
  chars.forEach((char) => counts.set(char, (counts.get(char) ?? 0) + 1));
  const max = Math.max(...counts.values());
  return max / chars.length > 0.4;
}

function hasOverRepeatedBigram(text: string): boolean {
  const letters = Array.from(text).filter((char) => /\p{L}/u.test(char));
  if (letters.length < 4) return false;
  const counts = new Map<string, number>();
  for (let i = 0; i < letters.length - 1; i += 1) {
    const gram = `${letters[i]}${letters[i + 1]}`;
    counts.set(gram, (counts.get(gram) ?? 0) + 1);
  }
  const max = Math.max(...counts.values());
  return max / letters.length > 0.4;
}
