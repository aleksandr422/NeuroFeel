"use client";

import { useEffect, useMemo, useState } from "react";
import crisisResources from "@/lib/crisisResources.json";
import { completeOnboarding, saveUserPreferences, setFlashMessage } from "@/lib/storage";
import { UserPreferences } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { DiaryInput } from "@/components/DiaryInput";

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [ageGroup, setAgeGroup] = useState<UserPreferences["ageGroup"]>();
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState<NonNullable<UserPreferences["supportStyles"]>[number]>("supportive_friend");

  const resources = useMemo(() => crisisResources[language], [language]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && step < 3) {
        event.preventDefault();
        setConfirmSkip(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const finish = () => {
    setFlashMessage(t.firstEntrySavedToast);
    completeOnboarding();
    onComplete();
  };

  if (step === 3) {
    return (
      <Card className="mx-auto mt-8 max-w-3xl">
        <h2 className="text-xl font-semibold">{t.onboardingStep3Title}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.onboardingStep3Text}</p>
        <div className="mt-4">
          <DiaryInput editingEntry={null} onEntryAdded={finish} onEntryUpdated={finish} initialText={t.firstEntryPrompt} onDone={finish} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-10 max-w-2xl">
      {step === 1 ? (
        <>
          <h2 className="text-2xl font-semibold">{t.onboardingStep1Title}</h2>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">{t.onboardingStep1Text}</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.onboardingHonesty}</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">{t.onboardingStep2Title}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.onboardingStep2Text}</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-sm">{t.onboardingAgeGroup}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "under_18", l: t.ageUnder18 },
                  { v: "18_25", l: t.age18to25 },
                  { v: "25_40", l: t.age25to40 },
                  { v: "40_plus", l: t.age40plus },
                  { v: "prefer_not_to_say", l: t.notSpecified },
                ].map((item) => (
                  <button key={item.v} onClick={() => setAgeGroup(item.v === "prefer_not_to_say" ? undefined : (item.v as UserPreferences["ageGroup"]))} type="button"><Chip tone={ageGroup === item.v ? "primary" : "neutral"}>{item.l}</Chip></button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm">{t.onboardingGoal}</p>
              <div className="flex flex-wrap gap-2">
                {[t.goalSelf, t.goalStress, t.goalTrackMood, t.goalOther].map((item) => (
                  <button key={item} onClick={() => setGoal(item)} type="button"><Chip tone={goal === item ? "primary" : "neutral"}>{item}</Chip></button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm">{t.onboardingTone}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "supportive_friend", l: t.toneSupportive },
                  { v: "reflective", l: t.toneNeutral },
                  { v: "short_direct", l: t.toneDirect },
                ].map((item) => (
                  <button key={item.v} onClick={() => setTone(item.v as NonNullable<UserPreferences["supportStyles"]>[number])} type="button"><Chip tone={tone === item.v ? "primary" : "neutral"}>{item.l}</Chip></button>
                ))}
              </div>
            </div>
          </div>
          {ageGroup === "under_18" ? (
            <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-warning-500)] bg-[var(--color-warning-100)] p-3 text-sm">
              <p>{t.onboardingUnder18Note}</p>
              <ul className="mt-2 list-inside list-disc">
                {resources.map((item) => (
                  <li key={item.name}>
                    {item.name}: {item.contact} ({item.url})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
      <div className="mt-6 flex gap-2">
        <Button variant="ghost" onClick={() => setConfirmSkip(true)}>{t.skip}</Button>
        <Button
          onClick={() => {
            if (step === 2) {
              saveUserPreferences({
                interests: [],
                lifestyle: "mixed",
                goals: goal,
                helps: [],
                supportStyles: [tone],
                ageGroup,
                avoidSuggestions: "",
              });
            }
            setStep((prev) => prev + 1);
          }}
        >
          {t.continueAnyway}
        </Button>
      </div>
      {confirmSkip ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm">
          <p>{t.skipOnboardingConfirm}</p>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" onClick={() => setConfirmSkip(false)}>{t.cancel}</Button>
            <Button variant="secondary" onClick={finish}>{t.skip}</Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
