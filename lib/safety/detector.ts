import { CRISIS_LEXICON } from "./crisisLexicon";

export type CrisisCategory = "suicidal" | "self_harm" | "abuse_danger" | "hopelessness_finality";

export type CrisisMatch = {
  category: CrisisCategory;
  matched: string[];
};

export function detectCrisisSignals(text: string, locale: "ru" | "en"): CrisisMatch[] {
  const normalized = normalize(text);
  if (!normalized) return [];
  const dict = CRISIS_LEXICON[locale];
  const matches: CrisisMatch[] = [];

  const suicidal = dict.suicidalIdeation.filter((phrase) => containsPhrase(normalized, phrase));
  if (suicidal.length) matches.push({ category: "suicidal", matched: suicidal });

  const selfHarm = dict.selfHarm.filter((phrase) => containsPhrase(normalized, phrase));
  if (selfHarm.length) matches.push({ category: "self_harm", matched: selfHarm });

  const abuse = dict.abuseDanger.filter((phrase) => containsPhrase(normalized, phrase));
  if (abuse.length) matches.push({ category: "abuse_danger", matched: abuse });

  const hopelessness = dict.hopelessness.filter((phrase) => containsPhrase(normalized, phrase));
  const finality = dict.finality.filter((phrase) => containsPhrase(normalized, phrase));
  if (hopelessness.length && finality.length) {
    matches.push({ category: "hopelessness_finality", matched: [...hopelessness, ...finality] });
  }

  return matches;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function containsPhrase(text: string, phrase: string): boolean {
  return text.includes(normalize(phrase));
}
