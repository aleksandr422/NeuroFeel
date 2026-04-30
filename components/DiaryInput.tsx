"use client";

import { useState } from "react";
import { AdviceCard } from "@/components/AdviceCard";
import { MoodPicker } from "@/components/MoodPicker";
import { NearbyHelp } from "@/components/NearbyHelp";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { analyzeEntry } from "@/lib/ai";
import { addEntry, getEntries, getUserPreferences, updateEntry } from "@/lib/storage";
import { AIAnalysis, DiaryEntry } from "@/lib/types";
import { getGenderedText } from "@/lib/genderText";
import { useLanguage } from "@/lib/useLanguage";
import { Energy, MOOD_SCALE_MAX, Mood, legacyMoodToMoodValue, moodValueToLegacyMood } from "@/lib/mood";
import { detectCrisisSignals } from "@/lib/safety/detector";
import { isLikelyMeaningful } from "@/lib/validation";
import { SupportCard } from "@/components/safety/SupportCard";
import { ScopeNotice } from "@/components/safety/ScopeNotice";

export function DiaryInput({
  editingEntry,
  onEntryAdded,
  onEntryUpdated,
  initialText,
  initialDate,
  onDone,
}: {
  editingEntry: DiaryEntry | null;
  onEntryAdded: (entry: DiaryEntry) => void;
  onEntryUpdated: (entry: DiaryEntry) => void;
  initialText?: string;
  initialDate?: string;
  onDone?: () => void;
}) {
  const [text, setText] = useState(editingEntry?.text ?? initialText ?? "");
  const [manualMood, setManualMood] = useState<Mood>(() => (editingEntry ? legacyMoodToMoodValue(editingEntry.manualMood) : 3));
  const [energy, setEnergy] = useState<Energy>(() => (editingEntry?.energy ? clampEnergy(editingEntry.energy) : 3));
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showSupportCard, setShowSupportCard] = useState(false);
  const [sessionHidden, setSessionHidden] = useState(false);
  const [entryHintDismissed, setEntryHintDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("minddiary.session.entryHintDismissed") === "1";
  });
  const { t, language } = useLanguage();
  const preferences = getUserPreferences();
  const isUnder18 = preferences?.ageGroup === "under_18";
  const showEntryHint = isUnder18 || !entryHintDismissed;
  const supportVisible = showSupportCard && !sessionHidden;

  const resetForm = () => {
    setText("");
    setManualMood(3);
    setEnergy(3);
  };

  const isEditMode = Boolean(editingEntry);
  const onAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const recentEntries = getEntries().slice(0, 5);
      const userPreferences = preferences;
      const crisisMatches = detectCrisisSignals(text, language);
      const crisisTriggered = crisisMatches.length > 0;
      const meaningful = isLikelyMeaningful(text, language);
      const aiResult = meaningful && !crisisTriggered ? await analyzeEntry(text, moodValueToLegacyMood(manualMood), language, recentEntries, userPreferences) : null;
      setAnalysis(crisisTriggered ? null : aiResult);
      setAnalyzedText(meaningful && !crisisTriggered ? text : "");
      setShowSupportCard(crisisTriggered);

      if (editingEntry) {
        const updatedEntry: DiaryEntry = {
          ...editingEntry,
          version: editingEntry.version ?? 2,
          text,
          manualMood: moodValueToLegacyMood(manualMood),
          energy,
          ...(aiResult ?? {
            mood: moodValueToLegacyMood(manualMood),
            moodLabel: t.moods[moodValueToLegacyMood(manualMood)],
            emotions: [],
            emotionLabels: [],
            problem: "",
            problemLabel: "",
            message: "",
            advice: "",
            tags: [],
            tagLabels: [],
            tagConfidences: [],
          }),
          safetySuppressed: crisisTriggered || undefined,
          updatedAt: new Date().toISOString(),
          isEdited: true,
        };
        updateEntry(editingEntry.id, updatedEntry);
        onEntryUpdated(updatedEntry);
        setStatusMessage(
          crisisTriggered
            ? t.entrySavedNeedDetailsHint
            : meaningful
            ? getGenderedText(
                {
                  male: "Ты обновил запись",
                  female: "Ты обновила запись",
                  neutral: t.entryUpdatedMessage,
                },
                userPreferences?.gender,
                language,
              )
            : t.entrySavedNeedDetailsHint,
        );
        resetForm();
        setAnalyzedText("");
        onDone?.();
      } else {
        const entry: DiaryEntry = {
          id: crypto.randomUUID(),
          version: 2,
          date: initialDate ? new Date(`${initialDate}T12:00:00`).toISOString() : new Date().toISOString(),
          text,
          manualMood: moodValueToLegacyMood(manualMood),
          energy,
          updatedAt: undefined,
          isEdited: false,
          ...(aiResult ?? {
            mood: moodValueToLegacyMood(manualMood),
            moodLabel: t.moods[moodValueToLegacyMood(manualMood)],
            emotions: [],
            emotionLabels: [],
            problem: "",
            problemLabel: "",
            message: "",
            advice: "",
            tags: [],
            tagLabels: [],
            tagConfidences: [],
          }),
          safetySuppressed: crisisTriggered || undefined,
        };

        addEntry(entry);
        onEntryAdded(entry);
        setStatusMessage(
          crisisTriggered
            ? t.entrySavedNeedDetailsHint
            : meaningful
            ? getGenderedText(
                {
                  male: "Ты добавил запись",
                  female: "Ты добавила запись",
                  neutral: t.entryAddedMessage,
                },
                userPreferences?.gender,
                language,
              )
            : t.entrySavedNeedDetailsHint,
        );
        resetForm();
        onDone?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-4" padding="md">
      <h2 className="text-xl font-semibold text-slate-900">{isEditMode ? t.editingEntry : t.dailyDiaryEntry}</h2>
      <SupportCard
        open={supportVisible}
        onContinue={() => setShowSupportCard(false)}
        onHideSession={() => {
          setSessionHidden(true);
          setShowSupportCard(false);
        }}
      />
      {showEntryHint ? (
        <Card tone="muted" padding="sm">
          <p className="text-sm text-[var(--color-text-muted)]">{t.entrySessionHint}</p>
          {!isUnder18 ? (
            <button
              type="button"
              className="mt-2 text-xs text-[var(--color-text-subtle)] underline"
              onClick={() => {
                setEntryHintDismissed(true);
                if (typeof window !== "undefined") sessionStorage.setItem("minddiary.session.entryHintDismissed", "1");
              }}
            >
              {t.hideInSession}
            </button>
          ) : null}
        </Card>
      ) : null}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.diaryPlaceholder}
        className="min-h-32"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          {t.mood}: {manualMood}/{MOOD_SCALE_MAX}
          <MoodPicker value={manualMood} onChange={setManualMood} labels={getScaleLabels(t)} />
        </label>
        <label className="text-sm text-slate-700">
          {t.energyLevel}: {energy}/{MOOD_SCALE_MAX}
          <MoodPicker value={energy} onChange={(value) => setEnergy(value)} labels={getScaleLabels(t)} />
        </label>
      </div>

      <Button
        onClick={onAnalyze}
        disabled={isLoading}
        variant="primary"
        size="md"
      >
        {isLoading ? t.analyzing : isEditMode ? t.updateEntry : t.analyze}
      </Button>
      {statusMessage && <p className="text-sm text-slate-600">{statusMessage}</p>}

      <AdviceCard analysis={analysis} />
      {analysis && <NearbyHelp text={analyzedText} tags={analysis.tags} />}
      <ScopeNotice text={t.autoSummaryDisclaimer} />
    </Card>
  );
}

function getScaleLabels(t: ReturnType<typeof useLanguage>["t"]): Record<Mood, string> {
  return {
    1: `${t.mood}: ${t.scaleVeryLow}`,
    2: `${t.mood}: ${t.scaleLow}`,
    3: `${t.mood}: ${t.scaleNeutral}`,
    4: `${t.mood}: ${t.scaleGood}`,
    5: `${t.mood}: ${t.scaleExcellent}`,
  };
}

function clampEnergy(value: number): Energy {
  if (value <= 1) return 1;
  if (value >= 5) return 5;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
}
