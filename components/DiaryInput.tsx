"use client";

import { useState } from "react";
import { AdviceCard } from "@/components/AdviceCard";
import { NearbyHelp } from "@/components/NearbyHelp";
import { analyzeEntry } from "@/lib/ai";
import { addEntry, getEntries, getUserPreferences, updateEntry } from "@/lib/storage";
import { AIAnalysis, DiaryEntry, Mood } from "@/lib/types";
import { getGenderedText } from "@/lib/genderText";
import { useLanguage } from "@/lib/useLanguage";

const moods: Mood[] = ["sad", "neutral", "happy", "angry", "anxious"];

export function DiaryInput({
  editingEntry,
  onEntryAdded,
  onEntryUpdated,
}: {
  editingEntry: DiaryEntry | null;
  onEntryAdded: (entry: DiaryEntry) => void;
  onEntryUpdated: (entry: DiaryEntry) => void;
}) {
  const [text, setText] = useState(editingEntry?.text ?? "");
  const [manualMood, setManualMood] = useState<Mood>(editingEntry?.manualMood ?? "neutral");
  const [energy, setEnergy] = useState(editingEntry?.energy ?? 3);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const { t, language } = useLanguage();

  const resetForm = () => {
    setText("");
    setManualMood("neutral");
    setEnergy(3);
  };

  const isEditMode = Boolean(editingEntry);
  const onAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const recentEntries = getEntries().slice(0, 5);
      const userPreferences = getUserPreferences();
      const aiResult = await analyzeEntry(text, manualMood, language, recentEntries, userPreferences);
      setAnalysis(aiResult);
      setAnalyzedText(text);

      if (editingEntry) {
        const updatedEntry: DiaryEntry = {
          ...editingEntry,
          text,
          manualMood,
          energy,
          ...aiResult,
          updatedAt: new Date().toISOString(),
          isEdited: true,
        };
        updateEntry(editingEntry.id, updatedEntry);
        onEntryUpdated(updatedEntry);
        setStatusMessage(
          getGenderedText(
            {
              male: "Ты обновил запись",
              female: "Ты обновила запись",
              neutral: t.entryUpdatedMessage,
            },
            userPreferences?.gender,
            language,
          ),
        );
        resetForm();
        setAnalyzedText("");
      } else {
        const entry: DiaryEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          text,
          manualMood,
          energy,
          updatedAt: undefined,
          isEdited: false,
          ...aiResult,
        };

        addEntry(entry);
        onEntryAdded(entry);
        setStatusMessage(
          getGenderedText(
            {
              male: "Ты добавил запись",
              female: "Ты добавила запись",
              neutral: t.entryAddedMessage,
            },
            userPreferences?.gender,
            language,
          ),
        );
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-semibold text-slate-900">{isEditMode ? t.editingEntry : t.dailyDiaryEntry}</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.diaryPlaceholder}
        className="min-h-32 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-400"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          {t.mood}
          <select
            value={manualMood}
            onChange={(e) => setManualMood(e.target.value as Mood)}
            className="mt-1 w-full rounded-xl border border-slate-300 p-2"
          >
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {t.moods[mood]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-700">
          {t.energyLevel}: {energy}/5
          <input
            type="range"
            min={1}
            max={5}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>
      </div>

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isLoading ? t.analyzing : isEditMode ? t.updateEntry : t.analyze}
      </button>
      {statusMessage && <p className="text-sm text-slate-600">{statusMessage}</p>}

      <AdviceCard analysis={analysis} />
      {analysis && <NearbyHelp text={analyzedText} tags={analysis.tags} />}
    </section>
  );
}
