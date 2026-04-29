/**
 * Crisis lexicon for local-only safety checks.
 * lastReviewedAt: 2026-04-29
 * Re-review interval: 180 days.
 */
export const CRISIS_LEXICON = {
  lastReviewedAt: "2026-04-29",
  ru: {
    suicidalIdeation: [
      "не хочу жить",
      "хочу умереть",
      "покончить с собой",
      "не вижу смысла жить",
      "лучше бы меня не было",
    ],
    selfHarm: [
      "режу себя",
      "причиняю себе боль",
      "наношу себе вред",
      "самоповреждение",
    ],
    abuseDanger: [
      "бьет меня",
      "бьёт меня",
      "мне угрожают",
      "не могу уйти",
      "мне небезопасно дома",
    ],
    hopelessness: ["никому не нужен", "никому не нужна", "больше нет смысла", "безнадежно", "безысходно"],
    finality: ["навсегда", "прощайте", "это конец", "в последний раз"],
  },
  en: {
    suicidalIdeation: ["i want to die", "kill myself", "end my life", "suicide", "don't want to live"],
    selfHarm: ["self-harm", "hurt myself", "cut myself", "harm myself"],
    abuseDanger: ["someone is hitting me", "i am not safe", "i can't leave", "i'm being abused"],
    hopelessness: ["no point in living", "nobody needs me", "hopeless", "there is no way out"],
    finality: ["goodbye forever", "this is the end", "for good", "last message"],
  },
} as const;
