export type SafetyResource = {
  name: string;
  purpose: string;
  phone?: string;
  url?: string;
  hours?: string;
  lastVerifiedAt: string;
};

export const SAFETY_RESOURCES: Record<"ru" | "en", SafetyResource[]> = {
  ru: [
    {
      name: "Детский телефон доверия",
      purpose: "Круглосуточная поддержка для детей и подростков",
      phone: "8-800-2000-122",
      url: "https://telefon-doveria.ru/",
      hours: "24/7",
      lastVerifiedAt: "2026-04-29",
    },
  ],
  en: [
    {
      name: "988 Suicide & Crisis Lifeline",
      purpose: "Immediate emotional crisis support",
      phone: "Call or text 988",
      url: "https://988lifeline.org/",
      hours: "24/7",
      lastVerifiedAt: "2026-04-29",
    },
  ],
};
