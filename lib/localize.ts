import { AIAnalysis, DiaryEntry, Mood } from "@/lib/types";
import { translations } from "@/lib/i18n";

export type UILanguage = keyof typeof translations;

function pickLanguage(language: UILanguage) {
  return translations[language];
}

export function localizeMood(mood: string, language: UILanguage, moodLabel?: string) {
  if (moodLabel) return moodLabel;
  const t = pickLanguage(language);
  return t.moods[mood as Mood] ?? mood;
}

export function localizeEmotion(emotion: string, language: UILanguage, emotionLabel?: string) {
  if (emotionLabel) return emotionLabel;
  const t = pickLanguage(language);
  return t.emotionsMap[emotion as keyof typeof t.emotionsMap] ?? emotion;
}

export function localizeProblem(problem: string, language: UILanguage, problemLabel?: string) {
  if (problemLabel) return problemLabel;
  const t = pickLanguage(language);
  const key = problem.trim().toLowerCase();
  return t.problemsMap[key as keyof typeof t.problemsMap] ?? problem;
}

export function localizeTag(tag: string, language: UILanguage, tagLabel?: string) {
  if (tagLabel) return tagLabel;
  const t = pickLanguage(language);
  return t.tagsMap[tag as keyof typeof t.tagsMap] ?? tag;
}

export function getLocalizedAnalysis(analysis: AIAnalysis, language: UILanguage) {
  return {
    moodLabel: localizeMood(analysis.mood, language, analysis.moodLabel),
    emotionLabels: analysis.emotions.map((emotion, index) =>
      localizeEmotion(emotion, language, analysis.emotionLabels?.[index]),
    ),
    problemLabel: localizeProblem(analysis.problem, language, analysis.problemLabel),
    tagLabels: analysis.tags.map((tag, index) => localizeTag(tag, language, analysis.tagLabels?.[index])),
  };
}

export function getLocalizedEntry(entry: DiaryEntry, language: UILanguage) {
  return getLocalizedAnalysis(entry, language);
}
