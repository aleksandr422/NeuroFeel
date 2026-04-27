import { Language } from "@/lib/i18n";
import { UserPreferences } from "@/lib/types";

type Gender = UserPreferences["gender"];

type GenderedTextOptions = {
  male: string;
  female: string;
  neutral: string;
};

export function getGenderedText(options: GenderedTextOptions, gender: Gender, language: Language) {
  if (language !== "ru") return options.neutral;
  if (gender === "male") return options.male;
  if (gender === "female") return options.female;
  return options.neutral;
}
