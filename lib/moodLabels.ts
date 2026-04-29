import { Language } from "./i18n";
import { Emotion } from "./mood";

export const emotionLabels: Record<Language, Record<Emotion, string>> = {
  en: {
    joy: "Joy",
    calm: "Calm",
    anxiety: "Anxiety",
    sadness: "Sadness",
    anger: "Anger",
    neutral: "Neutral",
  },
  ru: {
    joy: "Радость",
    calm: "Спокойствие",
    anxiety: "Тревога",
    sadness: "Грусть",
    anger: "Злость",
    neutral: "Нейтрально",
  },
};
